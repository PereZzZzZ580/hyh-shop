import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const res = await fetch(`${API_URL}/me/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const body = await req.text();
  const res = await fetch(`${API_URL}/me/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

