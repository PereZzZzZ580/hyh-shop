/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(
  req: NextRequest,
  context: any
) {
  const token = req.cookies.get("token")?.value;
  const { id } = (context.params as { id: string });
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  context: any
) {
  const token = req.cookies.get("token")?.value;
  const id = (context.params as { id: string }).id;

  const contentType = req.headers.get("content-type") || "";

  let res: Response;
  if (contentType.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
  } else {
    // Assume multipart/form-data or x-www-form-urlencoded
    const formData = await req.formData();
    res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
    context: any,
) {
  const { id } = (context.params as { id: string });
  const token = req.cookies.get("token")?.value;

  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
