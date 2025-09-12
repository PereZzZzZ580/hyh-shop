import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Enforce same-origin to mitigate login CSRF/session fixation
  const origin = req.headers.get("origin");
  // Permite por defecto el mismo origen desde el que se sirve la app
  const allowedOrigin = process.env.APP_ORIGIN || req.nextUrl.origin;
  if (origin && origin !== allowedOrigin) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
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
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: SAME_SITE,
    secure: SECURE_COOKIE,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día (coincide con expiresIn del backend)
  });
  return response;
}
