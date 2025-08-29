import { NextResponse } from "next/server";

export async function POST() {
  const SECURE_COOKIE = (process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production");
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: SECURE_COOKIE,
    path: "/",
    maxAge: 0,
  });
  return res;
}
