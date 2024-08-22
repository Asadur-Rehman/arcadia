import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use the edge-safe config (no bcryptjs/DB) so middleware runs on Edge Runtime.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icons/|images/|sample-video).*)",
  ],
};
