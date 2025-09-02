import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
const res = await fetch(`${API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const contentType = req.headers.get("content-type") || "";

  let res: Response;
  if (contentType.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    res = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  } else {
    const formData = await req.formData();
    res = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
