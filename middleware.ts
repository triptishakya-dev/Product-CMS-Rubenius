import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_change_me"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and /admin/register
  if (pathname.startsWith("/admin")) {
    // Exclude login and register pages from protection
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/register"
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      console.log("No token found, redirecting to login");
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }

    try {
      // Verify token
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      const url = new URL("/admin/login", request.url);
      // Clear the invalid cookie
      const response = NextResponse.redirect(url);
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
};
