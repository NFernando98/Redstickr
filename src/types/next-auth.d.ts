// next-auth.d.ts
import NextAuth from "next-auth";

// Extend the built-in session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id property here
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Extend the built-in user interface
declare module "next-auth/jwt" {
  interface JWT {
    uid?: string; // Add uid to the JWT type
  }
}
