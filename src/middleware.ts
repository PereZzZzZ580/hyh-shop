import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/ingresar", req.url));
    }
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("no auth");
      const me = await res.json();
      if (me.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (!token && pathname.startsWith("/mi-cuenta")) {
    return NextResponse.redirect(new URL("/ingresar", req.url));
  }

  return NextResponse.next();
}

export const config = {
   matcher: [
    "/mi-cuenta/:path*",
    "/admin/:path*",
  ],
};
