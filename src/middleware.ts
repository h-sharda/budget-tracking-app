import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If user is accessing auth pages, allow access
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }

        // Allow access to home page without authentication
        if (req.nextUrl.pathname === "/") {
          return true;
        }

        // For all other pages, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
