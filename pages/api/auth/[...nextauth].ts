import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../src/firebase";

const auth = getAuth(app);

export const authOptions = {
  session: {
    strategy: "jwt" as const, // Correct typing for 'jwt' strategy
  },
  providers: [
    // Google Sign-In provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Firebase Auth Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Authenticate the user with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials?.email || "",
            credentials?.password || ""
          );

          // If authentication is successful
          if (userCredential.user) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name:
                userCredential.user.displayName || userCredential.user.email,
            };
          }

          // Return null if authentication fails
          return null;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return null; // Return null if any error occurs during authentication
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"), // Replace escaped newlines
    }),
  }) as Adapter,
};

export default NextAuth(authOptions);
