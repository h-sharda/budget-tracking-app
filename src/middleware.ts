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
     * - All public folder files (sitemap, robots, icons, images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|android-chrome-192x192.png|android-chrome-512x512.png|apple-touch-icon.png|favicon-16x16.png|favicon-32x32.png|file.svg|globe.svg|icon.svg|next.svg|site.webmanifest|vercel.svg|window.svg|screenshots/).*)",
  ],
};
