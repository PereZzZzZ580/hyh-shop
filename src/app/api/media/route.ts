import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const search = req.nextUrl.searchParams.toString();
  const res = await fetch(`${API_URL}/media${search ? `?${search}` : ""}`, {
    cache: "no-store",
    headers: token ? { cookie: `token=${token}` } : undefined,
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
