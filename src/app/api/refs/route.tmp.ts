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

export const revalidate = 3600; // cache 1h en producciÃ³n

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const shape = (url.searchParams.get("shape") || "ovalado") as ShapeKey;
  const count = Math.min(12, Math.max(3, Number(url.searchParams.get("count") || 6)));
  const stylesParam = url.searchParams.get("styles") || ""; // CSV de estilos recomendados
  const styles = stylesParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 4); // limitar para no abusar de la API

  const apiKey = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_KEY; // por si acaso
  const fallback = Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${encodeURIComponent(shape)}-${i}/600/400`
  );

  if (!apiKey) {
    return NextResponse.json({ urls: fallback });
  }

  // Si el cliente envÃ­a estilos, hacemos varias consultas especÃ­ficas y agregamos
  if (styles.length > 0) {
    try {
      const perStyle = Math.max(1, Math.ceil(count / styles.length));
      const queries = styles.map((style) =>
        `men ${style} haircut ${shapeToQuery[shape] || "face"}`
      );
      const responses = await Promise.allSettled(
        queries.map((q) =>
          fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perStyle}&orientation=portrait`,
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
      const urls = Array.from(
        new Set(
          allPhotos
            .map((p: any) => p?.src?.medium || p?.src?.portrait || p?.src?.large)
            .filter(Boolean)
        )
      ).slice(0, count);
      if (!urls.length) return NextResponse.json({ urls: fallback });
      return NextResponse.json({ urls });
    } catch {
      return NextResponse.json({ urls: fallback });
    }
  }

  // Si no hay estilos, consulta genÃ©rica por forma de rostro
  const query = `men haircut ${shapeToQuery[shape] || "face"}`;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=portrait`,
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
      .map((p: any) => p?.src?.medium || p?.src?.portrait || p?.src?.large)
      .filter(Boolean);
    if (!urls.length) return NextResponse.json({ urls: fallback });
    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ urls: fallback });
  }
}

