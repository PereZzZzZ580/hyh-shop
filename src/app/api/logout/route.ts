import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const SECURE_COOKIE = (process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production");
  const sameSiteEnv = (process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === "production" ? "strict" : "lax")).toLowerCase();
  const SAME_SITE = (['lax','strict','none'].includes(sameSiteEnv) ? (sameSiteEnv as "lax"|"strict"|"none") : 'lax');
  const cookieDomain = process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN.trim() !== ''
    ? process.env.COOKIE_DOMAIN.trim()
    : undefined;
  res.cookies.set("token", "", { httpOnly: true, path: "/", maxAge: 0, sameSite: SAME_SITE, secure: SECURE_COOKIE, domain: cookieDomain });
  return res;
}
