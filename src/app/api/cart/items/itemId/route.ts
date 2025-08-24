import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const token = req.cookies.get("token")?.value;
  const res = await fetch(`${API_URL}/cart/items/${params.itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const token = req.cookies.get("token")?.value;
  const body = await req.json();
  const res = await fetch(`${API_URL}/cart/items/${params.itemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}