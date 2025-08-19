import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET() {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      cookie: `token=${token}`,
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
