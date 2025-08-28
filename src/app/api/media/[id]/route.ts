/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const token = req.cookies.get("token")?.value;
  const id = (context.params as { id: string }).id;
  const res = await fetch(`${API_URL}/media/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
