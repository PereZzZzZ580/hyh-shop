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
    `https://picsum.photos/seed/${encodeURIComponent(shape)}-${i}/600/900`
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
    "skin fade": ["skin fade", "bald fade"],
    textured: ["textured", "texture"],
    "textured crop": ["textured crop", "french crop"],
    crop: ["crop", "french crop"],
    "french crop": ["french crop", "textured crop"],
    "buzz cut": ["buzz cut", "induction cut"],
    "ivy league": ["ivy league", "harvard clip"],
    "slick back": ["slick back", "slicked back"],
    mullet: ["mullet"],
    "faux hawk": ["faux hawk", "fohawk"],
    curtains: ["curtains", "middle part"],
    "flat top": ["flat top"],
    caesar: ["caesar", "ceasar"],
    edgar: ["edgar cut", "takuache"],
    bowl: ["bowl cut"],
    "line up": ["line up", "shape up"],
    taper: ["taper", "taper fade"],
    "drop fade": ["drop fade"],
    "burst fade": ["burst fade"],
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
    // Spanish hints
    if (s.includes("desvanecido")) out.add("fade");
    if (s.includes("alto")) out.add("high fade");
    if ((s.includes("medio") && s.includes("fade")) || (s.includes("medio") && s.includes("desvanecido"))) out.add("mid fade");
    if (s.includes("bajo")) out.add("low fade");
    if (s.includes("piel")) out.add("skin fade");
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

  async function fetchPexels(q: string, perPage: number) {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perPage}&orientation=portrait&locale=en-US&page=1`,
      {
        headers: { Authorization: apiKey! },
        next: { revalidate },
      }
    );
    if (!res.ok) return [] as any[];
    const data = await res.json();
    return (data?.photos as any[]) || [];
  }

  // Optional providers: Unsplash and Pixabay (if keys present)
  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
  async function fetchUnsplash(q: string, perPage: number) {
    if (!UNSPLASH_KEY) return [] as any[];
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${perPage}&orientation=portrait`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
        next: { revalidate },
      }
    );
    if (!res.ok) return [] as any[];
    const data = await res.json();
    return (data?.results as any[]) || [];
  }

  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;
  async function fetchPixabay(q: string, perPage: number) {
    if (!PIXABAY_KEY) return [] as any[];
    const urlPix = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&per_page=${perPage}&image_type=photo&orientation=vertical&category=people&safesearch=true`;
    const res = await fetch(urlPix, { next: { revalidate } as any });
    if (!res.ok) return [] as any[];
    const data = await res.json();
    return (data?.hits as any[]) || [];
  }

  function rankPhotos(photos: any[], styleWords: string[]) {
    const negative = ["woman", "female", "girl", "lady", "kid", "child", "children"];
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
      "beard",
    ];
    return photos
      .map((p) => {
        const alt = (
          p?.alt ||
          p?.description ||
          p?.alt_description ||
          (Array.isArray(p?.tags) ? p.tags.map((t: any) => (t?.title || t)).join(" ") : p?.tags) ||
          p?.tags_en ||
          ""
        )
          .toString()
          .toLowerCase();
        let score = 0;
        for (const sw of styleWords) if (alt.includes(sw)) score += 5; // fuerte
        for (const hw of hairWords) if (alt.includes(hw)) score += 2;
        if (negative.some((n) => alt.includes(n))) score -= 8;
        // Preferir retratos verticales y tamaños grandes
        const width = p?.width || p?.imageWidth || p?.w || 0;
        const height = p?.height || p?.imageHeight || p?.h || 0;
        if (height >= width) score += 1;
        if (width >= 1200 || height >= 1200) score += 1;
        if (p?.src?.portrait || p?.urls?.regular || p?.largeImageURL) score += 1;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ p }) => p);
  }

  // 1) Con estilos -> múltiples consultas específicas + ranking
  if (styles.length > 0) {
    try {
      const perStyle = Math.min(15, Math.max(6, Math.ceil((count * 3) / styles.length)));
      const photoBuckets: any[] = [];
      for (const style of styles) {
        const kws = styleToKeywords(style);
        const extra = (kws.length ? kws : [style]).join(" ");
        const baseQuery = `male men barber hairstyle haircut ${extra} ${shapeQualifier} portrait close-up`;
        const altQuery = `men ${extra} haircut portrait barbershop`;
        const [a, b, u1, x1] = await Promise.all([
          fetchPexels(baseQuery, perStyle),
          fetchPexels(altQuery, Math.max(4, Math.floor(perStyle / 2))),
          fetchUnsplash(`${extra} haircut portrait`, Math.max(6, Math.floor(perStyle / 2))),
          fetchPixabay(`${extra} haircut man`, Math.max(6, Math.floor(perStyle / 2))),
        ]);
        const ranked = rankPhotos([...a, ...b, ...u1, ...x1], kws.length ? kws : [normalize(style)]);
        photoBuckets.push(...ranked);
      }
      const preferred = photoBuckets
        .map((p: any) => p?.src?.large2x || p?.src?.portrait || p?.src?.large || p?.src?.medium || p?.urls?.regular || p?.largeImageURL)
        .filter(Boolean);
      let urls = Array.from(new Set(preferred)).slice(0, count);

      // Fallback adicional con Unsplash (featured) si faltan
      if (urls.length < count) {
        const missing = count - urls.length;
        const styleString = normalize(styles.join(" ") || "haircut").replace(/\s+/g, ",");
        const base = `https://source.unsplash.com/800x1200/?male,men,haircut,hairstyle,barber,${styleString}`;
        for (let i = 0; i < missing; i++) urls.push(`${base}&sig=${i}`);
      }

      if (!urls.length) return NextResponse.json({ urls: fallback });
      return NextResponse.json({ urls });
    } catch {
      return NextResponse.json({ urls: fallback });
    }
  }

  // 2) Sin estilos -> consulta genérica por forma de rostro y ranking
  try {
    const query = `male men barber hairstyle haircut ${shapeQualifier} portrait close-up`;
    const [p1, u1, x1] = await Promise.all([
      fetchPexels(query, Math.max(12, count * 2)),
      fetchUnsplash(`men haircut portrait barber`, Math.max(8, count)),
      fetchPixabay(`men haircut portrait`, Math.max(8, count)),
    ]);
    const photos = [...p1, ...u1, ...x1];
    const ranked = rankPhotos(photos, []);
    let urls = ranked
      .map((p: any) => p?.src?.large2x || p?.src?.portrait || p?.src?.large || p?.src?.medium || p?.urls?.regular || p?.largeImageURL)
      .filter(Boolean)
      .slice(0, count);

    if (urls.length < count) {
      const base = `https://source.unsplash.com/800x1200/?male,men,haircut,hairstyle,barber`;
      const missing = count - urls.length;
      for (let i = 0; i < missing; i++) urls.push(`${base}&sig=${i}`);
    }

    if (!urls.length) return NextResponse.json({ urls: fallback });
    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ urls: fallback });
  }
}
