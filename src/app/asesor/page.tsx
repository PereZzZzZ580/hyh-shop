"use client";

import { useEffect, useRef, useState } from "react";

type Landmark = { x: number; y: number; z?: number; }; // normalized [0..1]

type ShapeKey =
  | "ovalado"
  | "redondo"
  | "cuadrado"
  | "rectangular"
  | "diamante"
  | "corazon"
  | "triangulo";

type AnalyzeResult = {
  shape: ShapeKey;
  score: number; // 0..1
  widthForehead: number;
  widthCheekbone: number;
  widthJaw: number;
  faceLength: number;
  tips?: string[];
};

// Usar WASM local para evitar problemas de MIME/CORS
const WASM_BASE = "/mediapipe/wasm";
const LOCAL_MODEL = "/models/face_landmarker.task";
const CDN_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const RECOMMENDATIONS: Record<ShapeKey, string[]> = {
  ovalado: [
    "Pompadour",
    "Quiff",
    "Corte con flequillo ligero",
    "Desvanecido medio",
  ],
  redondo: [
    "Pompadour alto",
    "Quiff con volumen",
    "Undercut",
    "Desvanecido alto con textura",
  ],
  cuadrado: [
    "Side part marcado",
    "Crew cut",
    "Corte clásico con volumen superior",
    "Texturizado medio",
  ],
  rectangular: [
    "Flequillo para acortar frente",
    "Medium crop",
    "Texturizado con caída",
    "Corte medio con capas",
  ],
  diamante: [
    "Corte con volumen lateral",
    "Fringe (flequillo) suave",
    "Side part con textura",
    "Largo medio peinado hacia delante",
  ],
  corazon: [
    "Side swept fringe",
    "Medium crop",
    "Fade bajo con textura",
    "Cortes que aporten volumen en laterales",
  ],
  triangulo: [
    "Volumen en zona superior",
    "Side part con laterales más llenos",
    "Cortes que equilibren la mandíbula",
    "Textura media",
  ],
};

// Backend: trae imágenes relevantes (Pexels) con fallback
async function fetchRefs(shape: ShapeKey, count = 6, styles?: string[]): Promise<string[]> {
  try {
    const params = new URLSearchParams({ shape, count: String(count) });
    if (styles && styles.length) {
      params.set("styles", styles.join(","));
    }
    const res = await fetch(`/api/refs?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.urls as string[]) || [];
  } catch {
    return [];
  }
}

function dist(a: Landmark, b: Landmark) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

// Medición de anchos por bandas horizontales en porcentajes de la altura total del rostro
function widthAtBand(landmarks: Landmark[], top: number, bottom: number) {
  const ys = landmarks.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const h = maxY - minY || 1e-6;
  const yTop = minY + top * h;
  const yBottom = minY + bottom * h;
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  for (const p of landmarks) {
    if (p.y >= yTop && p.y <= yBottom) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }
  }
  if (!isFinite(minX) || !isFinite(maxX)) return 0;
  return maxX - minX;
}

function analyzeFace(landmarks: Landmark[]): AnalyzeResult | null {
  if (!landmarks || landmarks.length === 0) return null;
  const xs = landmarks.map((p) => p.x);
  const ys = landmarks.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const faceLength = maxY - minY; // altura normalizada

  // bandas: frente (20-30%), pómulos (45-55%), mandíbula (70-80%)
  const widthForehead = widthAtBand(landmarks, 0.20, 0.30);
  const widthCheekbone = widthAtBand(landmarks, 0.45, 0.55);
  const widthJaw = widthAtBand(landmarks, 0.70, 0.80);

  const ratio = faceLength / Math.max(widthCheekbone, 1e-6);
  const widths = [widthForehead, widthCheekbone, widthJaw];
  const maxW = Math.max(...widths);
  const minW = Math.min(...widths);
  const spread = maxW - minW;

  // Heurísticas simples para clasificar forma del rostro
  const scores: Partial<Record<ShapeKey, number>> = {};

  // diamante: pómulos ampliamente > frente y mandíbula
  const diamondMargin = Math.min(
    (widthCheekbone - widthForehead) / Math.max(widthCheekbone, 1e-6),
    (widthCheekbone - widthJaw) / Math.max(widthCheekbone, 1e-6)
  );
  if (diamondMargin > 0.06) {
    scores.diamante = Math.min(1, 0.7 + diamondMargin * 3);
  }

  // corazón: frente > mandíbula notablemente
  const heartMargin = (widthForehead - widthJaw) / Math.max(widthCheekbone, 1e-6);
  if (heartMargin > 0.07) {
    scores.corazon = Math.min(1, 0.65 + heartMargin * 2.5);
  }

  // triángulo: mandíbula > frente notablemente
  const triMargin = (widthJaw - widthForehead) / Math.max(widthCheekbone, 1e-6);
  if (triMargin > 0.07) {
    scores.triangulo = Math.min(1, 0.65 + triMargin * 2.5);
  }

  // rectangular: rostro largo y anchos parecidos
  if (ratio >= 1.6 && spread < 0.08 * widthCheekbone) {
    scores.rectangular = Math.min(1, 0.6 + (ratio - 1.6));
  }

  // cuadrado: ratio medio y anchos parecidos, mandíbula fuerte
  if (ratio >= 1.35 && ratio <= 1.6 && spread < 0.06 * widthCheekbone) {
    const jawStrength = 1 - Math.abs(widthJaw - widthCheekbone) / Math.max(widthCheekbone, 1e-6);
    scores.cuadrado = Math.min(1, 0.6 + jawStrength * 0.4);
  }

  // redondo: ratio bajo y anchos parecidos
  if (ratio < 1.35 && spread < 0.06 * widthCheekbone) {
    scores.redondo = Math.min(1, 0.6 + (1.35 - ratio));
  }

  // ovalado: rostro más largo que ancho con mandíbula algo más estrecha
  if (ratio >= 1.4 && ratio <= 1.75 && widthForehead > widthJaw) {
    const taper = (widthForehead - widthJaw) / Math.max(widthCheekbone, 1e-6);
    scores.ovalado = Math.min(1, 0.55 + Math.max(0, (ratio - 1.4)) + Math.max(0, taper));
  }

  // Elegir la mejor puntuación
  let best: ShapeKey = "ovalado";
  let bestScore = -1;
  (Object.keys(scores) as ShapeKey[]).forEach((k) => {
    const s = scores[k] ?? 0;
    if (s > bestScore) {
      best = k;
      bestScore = s;
    }
  });

  // Si ninguna regla fuerte, caer a heurística básica
  if (bestScore < 0) {
    if (ratio > 1.6) best = "rectangular";
    else if (ratio < 1.3) best = "redondo";
    else best = "ovalado";
    bestScore = 0.5;
  }

  return {
    shape: best,
    score: Math.max(0, Math.min(1, bestScore)),
    widthForehead,
    widthCheekbone,
    widthJaw,
    faceLength,
  };
}

export default function AsesorPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [modelReady, setModelReady] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [currentImgUrl, setCurrentImgUrl] = useState<string | null>(null);
  const [usingCamera, setUsingCamera] = useState(false);

  const [landmarks, setLandmarks] = useState<Landmark[] | null>(null);

  // Contador de imágenes de galería visibles (cuando existan en /public/refs)
  const [visibleGallery, setVisibleGallery] = useState(0);

  const [gallery, setGallery] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  // Resetear estilo al cambiar la forma detectada
  useEffect(() => {
    setSelectedStyle(null);
  }, [result?.shape]);

  // Cargar galería con forma + estilo seleccionado (si aplica)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const shape = result?.shape;
      if (!shape) return;
      setVisibleGallery(0);
      setLoadingGallery(true);
      const styles = selectedStyle ? [selectedStyle] : (RECOMMENDATIONS[shape] || []).slice(0, 3);
      const urls = await fetchRefs(shape, 6, styles);
      if (!cancelled) {
        setGallery(urls);
        setLoadingGallery(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result?.shape, selectedStyle]);

  // MediaPipe instances
  const faceLandmarkerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      try {
        setLoadingModel(true);
        setError(null);
        const visionMod = await import("@mediapipe/tasks-vision");
        const { FilesetResolver, FaceLandmarker } = visionMod as any;

        const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
        // intentar local, caer a CDN si falla
        try {
          faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: LOCAL_MODEL },
            runningMode: "IMAGE",
            numFaces: 1,
          });
        } catch (e) {
          // fallback CDN del modelo
          faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: CDN_MODEL },
            runningMode: "IMAGE",
            numFaces: 1,
          });
        }
        if (!cancelled) setModelReady(true);
      } catch (e: any) {
        if (!cancelled) setError("No se pudo cargar el modelo de detección.");
      } finally {
        if (!cancelled) setLoadingModel(false);
      }
    }
    loadModel();
    return () => {
      cancelled = true;
    };
  }, []);

  async function analyzeImageBitmap(bmp: ImageBitmap, width: number, height: number) {
    if (!faceLandmarkerRef.current) return;
    const canvas = canvasRef.current!;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, width, height);

    // convertir landmarks normalizados a espacio de imagen para dibujar
    const detection = faceLandmarkerRef.current.detect(bmp);
    const lms: Landmark[] | undefined = detection?.faceLandmarks?.[0];
    if (!lms) {
      setLandmarks(null);
      setResult(null);
      setError("No se detectó ningún rostro. Prueba otra toma, con luz frontal y el rostro centrado.");
      return;
    }
    setError(null);
    setLandmarks(lms);

    // dibujar puntos principales (opcional)
    ctx.fillStyle = "rgba(255,215,0,0.9)";
    for (const p of lms) {
      const x = p.x * width;
      const y = p.y * height;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const analyzed = analyzeFace(lms);
    if (analyzed) setResult(analyzed);
  }

  async function handleFile(file: File) {
    setProcessing(true);
    setError(null);
    try {
      const url = URL.createObjectURL(file);
      setCurrentImgUrl(url);
      const img = await createImageBitmap(await (await fetch(url)).blob());
      await analyzeImageBitmap(img, img.width, img.height);
    } catch (e) {
      setError("Error procesando la imagen.");
    } finally {
      setProcessing(false);
    }
  }

  // Obtiene un stream de cámara con comprobaciones y fallbacks
  async function ensureCameraStream(): Promise<MediaStream> {
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
    if (!window.isSecureContext && !isLocalhost) {
      throw new Error("Necesitas usar HTTPS o localhost para usar la cámara.");
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Tu navegador no soporta cámara o está deshabilitada.");
    }

    try {
      return await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "user" } } });
    } catch (err: any) {
      if (err?.name === "OverconstrainedError" || err?.name === "NotFoundError") {
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => [] as MediaDeviceInfo[]);
        const firstCam = (devices as MediaDeviceInfo[]).find((d) => d.kind === "videoinput");
        if (firstCam) {
          try {
            return await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: firstCam.deviceId } } });
          } catch {}
        }
      }
      try {
        return await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (e2: any) {
        const name = e2?.name ?? err?.name;
        if (name === "NotAllowedError") throw new Error("Permiso denegado. Revisa los permisos del navegador.");
        if (name === "NotFoundError") throw new Error("No se encontró una cámara en este dispositivo.");
        if (name === "NotReadableError") throw new Error("La cámara está en uso por otra aplicación.");
        if (name === "OverconstrainedError") throw new Error("No se pudo usar la cámara solicitada.");
        if (name === "SecurityError") throw new Error("Bloqueado por la política de permisos del sitio.");
        throw new Error("No se pudo acceder a la cámara.");
      }
    }
  }

  async function startCameraImproved() {
    try {
      // Primero solicita el stream dentro del gesto del usuario
      const stream = await ensureCameraStream();

      // Asegura que el elemento <video> exista antes de asignar el stream
      setUsingCamera(true);
      await new Promise((r) => setTimeout(r, 0));
      let attempts = 0;
      while (!videoRef.current && attempts < 10) {
        await new Promise((r) => setTimeout(r, 50));
        attempts++;
      }
      const video = videoRef.current;
      if (!video) throw new Error("No se pudo inicializar el elemento de video.");
      (video as HTMLVideoElement).srcObject = stream;
      try { await (video as HTMLVideoElement).play(); } catch {}
    } catch (e: any) {
      setUsingCamera(false);
      setError(e?.message || "No se pudo acceder a la cámara.");
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setUsingCamera(true);
    } catch (e) {
      setError("No se pudo acceder a la cámara.");
    }
  }

  function stopCamera() {
    const video = videoRef.current;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
    setUsingCamera(false);
  }

  async function captureFromVideo() {
    const video = videoRef.current!;
    if (!video.videoWidth || !video.videoHeight) return;
    const off = document.createElement("canvas");
    off.width = video.videoWidth;
    off.height = video.videoHeight;
    const ctx = off.getContext("2d")!;
    ctx.drawImage(video, 0, 0, off.width, off.height);
    const blob: Blob = await new Promise((res) => off.toBlob((b) => res(b!), "image/jpeg", 0.95));
    const bmp = await createImageBitmap(blob);
    const url = URL.createObjectURL(blob);
    setCurrentImgUrl(url);
    setVisibleGallery(0);
    await analyzeImageBitmap(bmp, bmp.width, bmp.height);
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const canAnalyze = modelReady && !processing;

  return (
    <div className="min-h-screen py-10">
      {/* Hero */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,215,0,0.12)] via-black/20 to-black/40 p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gold">Asesor de Corte</h1>
        <p className="mt-2 text-sm md:text-base text-white/70">
          Descubre tu forma de rostro y obtén sugerencias de cortes ideales.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="border-2 border-gold/80 text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black transition-colors"
            onClick={() => (usingCamera ? stopCamera() : startCameraImproved())}
            disabled={loadingModel}
          >
            {usingCamera ? "Detener cámara" : "Usar cámara"}
          </button>
          <button
            className="border-2 border-gold/80 text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black disabled:opacity-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingModel}
          >
            Subir foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setVisibleGallery(0);
                void handleFile(f);
              }
            }}
          />
          <button
            className="border-2 border-gold/80 text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black disabled:opacity-50 transition-colors"
            onClick={() => captureFromVideo()}
            disabled={!usingCamera || !canAnalyze}
          >
            Capturar foto
          </button>
          {loadingModel && (
            <span className="text-sm text-white/70">Cargando herramienta…</span>
          )}
        </div>
        <div className="mt-2 text-xs text-white/60">
          Consejo: usa buena luz frontal y mira de frente a la cámara.
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vista */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 min-h-[240px] flex items-center justify-center">
              {usingCamera ? (
                <video ref={videoRef} className="w-full h-auto" playsInline autoPlay muted />
              ) : currentImgUrl ? (
                <img src={currentImgUrl} alt="captura" className="w-full h-auto object-contain" />
              ) : (
                <div className="p-6 text-center text-sm text-white/60">Tu vista previa aparecerá aquí</div>
              )}
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 min-h-[240px]">
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>
          </div>

          {/* Resultados bonitos */}
          {result && (
            <div className="mt-2 p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/60">Forma detectada</div>
                  <div className="text-2xl font-semibold capitalize text-gold">{result.shape}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Confianza</div>
                  <div className="text-lg font-medium">{(result.score * 100).toFixed(0)}%</div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded bg-white/10 overflow-hidden">
                <div
                  className="h-2 bg-gold"
                  style={{ width: `${Math.max(8, Math.min(100, Math.round(result.score * 100)))}%` }}
                />
              </div>

              {/* Métricas de rostro */}
              <div className="mt-4">
                <div className="text-sm text-white/60 mb-2">Mediciones del rostro</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/70">
                  <div className="rounded-lg border border-white/10 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-white/50">Frente</div>
                    <div className="font-medium">{result.widthForehead.toFixed(3)}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-white/50">Pómulos</div>
                    <div className="font-medium">{result.widthCheekbone.toFixed(3)}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-white/50">Mandíbula</div>
                    <div className="font-medium">{result.widthJaw.toFixed(3)}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-2">
                    <div className="text-[11px] uppercase tracking-wide text-white/50">Largo</div>
                    <div className="font-medium">{result.faceLength.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sugerencias + Galería */}
        <div className="w-full lg:w-[380px] space-y-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-semibold mb-2">Cortes recomendados</div>
            <div className="flex flex-wrap gap-2">
              {!result && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">
                  Sube o captura una foto para ver sugerencias
                </span>
              )}
              {result && (
                <>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                      selectedStyle === null
                        ? "bg-gold text-black border-gold"
                        : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                    }`}
                    aria-pressed={selectedStyle === null}
                    onClick={() => setSelectedStyle(null)}
                  >
                    Todos
                  </button>
                  {RECOMMENDATIONS[result.shape].map((rec, i) => (
                    <button
                      type="button"
                      key={i}
                      className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                        selectedStyle === rec
                          ? "bg-gold text-black border-gold"
                          : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                      }`}
                      aria-pressed={selectedStyle === rec}
                      onClick={() => setSelectedStyle(rec)}
                    >
                      {rec}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Renderizar galería solo si hay al menos 1 imagen visible */}
          {result && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="text-xl font-semibold mb-2">
                Ejemplos {selectedStyle ? `· ${selectedStyle}` : "similares"}
              </div>
              {loadingGallery && (
                <div className="text-sm text-white/60 mb-2">Cargando ejemplos…</div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {gallery.map((src, i) => (
                  <img
                    key={`${src}-${i}`}
                    src={src}
                    alt={`Ejemplo ${i + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onLoad={() => setVisibleGallery((n) => n + 1)}
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                ))}
              </div>
              {visibleGallery === 0 && (
                <div className="text-sm text-white/60">Pronto añadiremos más ejemplos visuales.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
