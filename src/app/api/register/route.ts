import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Enforce same-origin to mitigate CSRF for registration
  const origin = req.headers.get("origin");
  const allowedOrigin = process.env.APP_ORIGIN || req.nextUrl.origin;
  if (origin && origin !== allowedOrigin) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }
  const body = await req.json();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "No se pudo registrar el usuario" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error de conexion con la API" },
      { status: 502 }
    );
  }
}
