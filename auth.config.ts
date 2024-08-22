import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config — no Node.js-only dependencies (no bcryptjs, no DB).
// Imported by middleware.ts which runs on the Edge Runtime.
// auth.ts extends this with the Credentials provider (Node.js only).
export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
