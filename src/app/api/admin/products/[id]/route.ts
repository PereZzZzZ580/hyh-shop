import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API_URL}/admin/products/${params.id}`, {
    headers: { cookie: `token=${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("token")?.value;
  const formData = await req.formData();
  const res = await fetch(`${API_URL}/admin/products/${params.id}`, {
    method: "PATCH",
    body: formData,
    headers: { cookie: `token=${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API_URL}/admin/products/${params.id}`, {
    method: "DELETE",
    headers: { cookie: `token=${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
