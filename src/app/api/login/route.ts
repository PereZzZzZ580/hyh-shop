import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    return NextResponse.json({ error: msg || "Error" }, { status: res.status });
  }
  const data = await res.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", data.accessToken, {
    httpOnly: true,
    path: "/",
  });
  return response;
}
