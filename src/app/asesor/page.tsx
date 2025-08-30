"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

const CDN_WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";
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

// Galería: si no existen estos archivos en /public/refs, simplemente no se mostrarán (se ocultan onError)
const GALLERY: Record<ShapeKey, string[]> = {
  ovalado: ["/refs/ovalado_1.jpg", "/refs/ovalado_2.jpg"],
  redondo: ["/refs/redondo_1.jpg", "/refs/redondo_2.jpg"],
  cuadrado: ["/refs/cuadrado_1.jpg", "/refs/cuadrado_2.jpg"],
  rectangular: ["/refs/rectangular_1.jpg", "/refs/rectangular_2.jpg"],
  diamante: ["/refs/diamante_1.jpg", "/refs/diamante_2.jpg"],
  corazon: ["/refs/corazon_1.jpg", "/refs/corazon_2.jpg"],
  triangulo: ["/refs/triangulo_1.jpg", "/refs/triangulo_2.jpg"],
};

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

  const gallery = useMemo(() => {
    const k: ShapeKey | undefined = result?.shape;
    return k ? GALLERY[k] : [];
  }, [result?.shape]);

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

        const vision = await FilesetResolver.forVisionTasks(CDN_WASM);
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
      setError("No se detectó rostro. Intenta con otra foto o más luz.");
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
    await analyzeImageBitmap(bmp, bmp.width, bmp.height);
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const canAnalyze = modelReady && !processing;

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold text-gold mb-2">Asesor de Corte</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Sube una foto o usa la cámara. El análisis se realiza en tu navegador
        usando MediaPipe (no se envían imágenes al servidor).
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda: controles y vista */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              className="border-2 border-gold/80 text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black"
              onClick={() => (usingCamera ? stopCamera() : startCamera())}
              disabled={loadingModel}
            >
              {usingCamera ? "Detener cámara" : "Usar cámara"}
            </button>
            <button
              className="border-2 border-gold/80 text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black disabled:opacity-50"
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
                if (f) void handleFile(f);
              }}
            />
            <button
              className="border-2 border-gold/80 text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black disabled:opacity-50"
              onClick={() => captureFromVideo()}
              disabled={!usingCamera || !canAnalyze}
            >
              Capturar foto
            </button>
          </div>

          {loadingModel && (
            <div className="text-sm text-muted-foreground">Cargando modelo…</div>
          )}
          {error && (
            <div className="text-red-400">{error}</div>
          )}

          {/* Vista de cámara o imagen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10">
              {usingCamera ? (
                <video ref={videoRef} className="w-full h-auto" playsInline muted />
              ) : currentImgUrl ? (
                <img src={currentImgUrl} alt="captura" className="w-full h-auto object-contain" />
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">Sin vista previa</div>
              )}
            </div>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10">
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>
          </div>

          {/* Resultados */}
          {result && (
            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="text-lg">
                Forma detectada: <span className="font-semibold capitalize">{result.shape}</span>
              </div>
              <div className="text-sm text-muted-foreground">Score: {(result.score * 100).toFixed(0)}%</div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div>Frente: {(result.widthForehead).toFixed(3)}</div>
                <div>Pómulos: {(result.widthCheekbone).toFixed(3)}</div>
                <div>Mandíbula: {(result.widthJaw).toFixed(3)}</div>
                <div>Largo: {(result.faceLength).toFixed(3)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: recomendaciones y galería */}
        <div className="w-full lg:w-[380px] space-y-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-semibold mb-2">Cortes recomendados</div>
            <ul className="list-disc list-inside text-sm">
              {(result ? RECOMMENDATIONS[result.shape] : [
                "Sube o captura una foto para ver sugerencias",
              ]).map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="text-xl font-semibold mb-2">Galería</div>
            {gallery && gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {gallery.map((src, i) => (
                  // Ocultar si la imagen no existe en /public/refs
                  <img
                    key={i}
                    src={src}
                    alt={`ref ${i + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Agrega imágenes de referencia en <code className="font-mono">/public/refs</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nota sobre el modelo */}
      <div className="mt-6 text-xs text-muted-foreground">
        Modelo: se carga desde <code className="font-mono">/models/face_landmarker.task</code> si existe; de lo contrario, se usa un CDN oficial de MediaPipe.
      </div>
    </div>
  );
}
