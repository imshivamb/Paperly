import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  
  // Allow auth-related routes
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Redirect to papers if already logged in
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/papers", req.url))
  }

  // Require auth for protected routes
  if (!token && req.nextUrl.pathname.startsWith("/papers")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/papers/:path*",
    "/api/:path*",
    "/settings/:path*",
    "/login",
  ],
}