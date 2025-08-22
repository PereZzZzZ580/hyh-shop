import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const formData = await req.formData();
  const res = await fetch(`${API_URL}/media/upload-many`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
