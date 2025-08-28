import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
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
  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día (coincide con expiresIn del backend)
  });
  return response;
}
