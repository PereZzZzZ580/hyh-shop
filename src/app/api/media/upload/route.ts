import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  const token = cookies().get("token")?.value;
  const formData = await req.formData();
  const res = await fetch(`${API_URL}/media/upload-many`, {
    method: "POST",
    body: formData,
    headers: { cookie: `token=${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
