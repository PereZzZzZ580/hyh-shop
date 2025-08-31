import { NextRequest, NextResponse } from "next/server";

type ShapeKey =
  | "ovalado"
  | "redondo"
  | "cuadrado"
  | "rectangular"
  | "diamante"
  | "corazon"
  | "triangulo";

const shapeToQuery: Record<ShapeKey, string> = {
  ovalado: "oval face",
  redondo: "round face",
  cuadrado: "square face",
  rectangular: "oblong face",
  diamante: "diamond face",
  corazon: "heart face",
  triangulo: "triangle face",
};

export const revalidate = 3600; // cache 1h en producción

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const shape = (url.searchParams.get("shape") || "ovalado") as ShapeKey;
  const count = Math.min(12, Math.max(3, Number(url.searchParams.get("count") || 6)));
  const stylesParam = url.searchParams.get("styles") || ""; // CSV de estilos recomendados
  const styles = stylesParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 4);

  const apiKey = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_KEY; // por si acaso
  const fallback = Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${encodeURIComponent(shape)}-${i}/600/400`
  );

  if (!apiKey) {
    return NextResponse.json({ urls: fallback });
  }

  // Normalizador y diccionario de estilos -> keywords en inglés
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const STYLE_KEYWORDS: Record<string, string[]> = {
    pompadour: ["pompadour"],
    quiff: ["quiff"],
    undercut: ["undercut"],
    "crew cut": ["crew cut", "crewcut"],
    "side part": ["side part", "comb over"],
    fringe: ["fringe", "bangs"],
    fade: ["fade", "taper fade"],
    "low fade": ["low fade"],
    "mid fade": ["mid fade", "medium fade"],
    "high fade": ["high fade"],
    textured: ["textured", "texture"],
    "textured crop": ["textured crop", "french crop"],
    crop: ["crop", "french crop"],
    layers: ["layers", "layered"],
    "medium length": ["medium length", "medium hair"],
    "side swept fringe": ["side swept fringe", "side fringe"],
    "volume on top": ["volume on top", "voluminous top"],
  };

  function styleToKeywords(style: string): string[] {
    const s = normalize(style);
    const out = new Set<string>();
    for (const key of Object.keys(STYLE_KEYWORDS)) {
      if (s.includes(normalize(key))) STYLE_KEYWORDS[key].forEach((k) => out.add(k));
    }
    if (s.includes("desvanecido")) out.add("fade");
    if (s.includes("alto")) out.add("high fade");
    if ((s.includes("medio") && s.includes("fade")) || (s.includes("medio") && s.includes("desvanecido"))) out.add("mid fade");
    if (s.includes("bajo")) out.add("low fade");
    if (s.includes("flequillo")) out.add("fringe");
    if (s.includes("texturiz")) out.add("textured");
    if (s.includes("capas")) out.add("layers");
    if (s.includes("medium crop")) out.add("textured crop");
    if (s.includes("corte medio") || s.includes("largo medio") || s === "medio") out.add("medium length");
    if (s.includes("volumen")) out.add("volume on top");
    if (s.includes("laterales")) out.add("side part");
    return Array.from(out);
  }

  const shapeQualifier = shapeToQuery[shape] || "face";

  // Si el cliente envía estilos, hacemos varias consultas específicas y agregamos
  if (styles.length > 0) {
    try {
      const perStyle = Math.max(1, Math.ceil(count / styles.length));
      const queries = styles.map((style) => {
        const kws = styleToKeywords(style);
        const extra = kws.length ? kws.join(" ") : style;
        return `male men barber hairstyle haircut ${extra} ${shapeQualifier} portrait close-up`;
      });
      const responses = await Promise.allSettled(
        queries.map((q) =>
          fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perStyle}&orientation=portrait&locale=en-US&page=1`,
            {
              headers: { Authorization: apiKey },
              next: { revalidate },
            }
          )
        )
      );
      const allPhotos: any[] = [];
      for (const r of responses) {
        if (r.status === "fulfilled" && r.value.ok) {
          try {
            const data = await r.value.json();
            if (Array.isArray(data?.photos)) allPhotos.push(...data.photos);
          } catch {}
        }
      }
      const hairWords = [
        "hair",
        "hairstyle",
        "haircut",
        "barber",
        "pompadour",
        "quiff",
        "fade",
        "undercut",
        "fringe",
        "layers",
        "textured",
        "crop",
        "crew",
        "side part",
      ];
      const filtered = allPhotos.filter((p: any) => {
        const alt = String(p?.alt || "").toLowerCase();
        return hairWords.some((w) => alt.includes(w));
      });
      const preferred = (filtered.length ? filtered : allPhotos)
        .map((p: any) => p?.src?.medium || p?.src?.portrait || p?.src?.large)
        .filter(Boolean);
      const urls = Array.from(new Set(preferred)).slice(0, count);
      if (!urls.length) return NextResponse.json({ urls: fallback });
      return NextResponse.json({ urls });
    } catch {
      return NextResponse.json({ urls: fallback });
    }
  }

  // Si no hay estilos, consulta genérica por forma de rostro
  const query = `male men barber hairstyle haircut ${shapeQualifier} portrait close-up`;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=portrait&locale=en-US&page=1`,
      {
        headers: { Authorization: apiKey },
        // habilita cache en Next; los CDN de Pexels ya responden con cache
        next: { revalidate },
      }
    );
    if (!res.ok) {
      return NextResponse.json({ urls: fallback }, { status: 200 });
    }
    const data = await res.json();
    const urls = (data?.photos || [])
      .filter((p: any) => {
        const alt = String(p?.alt || "").toLowerCase();
        return (
          alt.includes("hair") ||
          alt.includes("hairstyle") ||
          alt.includes("haircut") ||
          alt.includes("barber")
        );
      })
      .map((p: any) => p?.src?.medium || p?.src?.portrait || p?.src?.large)
      .filter(Boolean);
    if (!urls.length) return NextResponse.json({ urls: fallback });
    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ urls: fallback });
  }
}

