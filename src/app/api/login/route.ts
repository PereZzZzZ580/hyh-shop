import { NextRequest, NextResponse } from "next/server";

function normalize(o?: string | null) {
  try {
    if (!o) return null;
    const u = new URL(o);
    // normaliza a solo hostname, ignorando www y puertos/esquema
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // Enforce same-origin to mitigate login CSRF/session fixation
  const origin = req.headers.get("origin");

  const enforce = String(process.env.ENABLE_ORIGIN_CHECK || "").toLowerCase() === "true";
  if (enforce && origin) {
    // Construye lista de orígenes permitidos
    const list: string[] = [];
    const envList = process.env.ALLOWED_ORIGINS || process.env.APP_ORIGIN || "";
    if (envList) list.push(...envList.split(",").map((s) => s.trim()).filter(Boolean));
    list.push(req.nextUrl.origin);

    const normalizedOrigin = normalize(origin);
    const allowed = list
      .map((o) => normalize(o))
      .filter(Boolean) as string[];

    const ok = allowed.includes(normalizedOrigin || "");
    if (!ok) {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
    }
  }

  const body = await req.json();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  // Permite desactivar la cookie "secure" en despliegues sin HTTPS
  const SECURE_COOKIE = (process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production");

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message || "Error de autenticación" },
      { status: res.status }
    );
  }
  const token = data.access_token ?? data.accessToken;
  if (!token) {
    return NextResponse.json(
      { error: "Token de acceso no recibido" },
      { status: 500 }
    );
  }

  const sameSiteEnv = (process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === "production" ? "strict" : "lax")).toLowerCase();
  const SAME_SITE = (['lax','strict','none'].includes(sameSiteEnv) ? (sameSiteEnv as "lax"|"strict"|"none") : 'lax');

  const response = NextResponse.json({ ok: true });
  const cookieDomain = process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN.trim() !== ''
    ? process.env.COOKIE_DOMAIN.trim()
    : undefined;
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: SAME_SITE,
    secure: SECURE_COOKIE,
    path: "/",
    domain: cookieDomain,
    maxAge: 60 * 60 * 24, // 1 día (coincide con expiresIn del backend)
  });
  return response;
}
