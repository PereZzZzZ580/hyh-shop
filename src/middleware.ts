import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/checkout") ||
      req.nextUrl.pathname.startsWith("/mi-cuenta") ||
      req.nextUrl.pathname.startsWith("/pedido"))
  ) {
    return NextResponse.redirect(new URL("/ingresar", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/mi-cuenta/:path*", "/pedido/:path*"],
};