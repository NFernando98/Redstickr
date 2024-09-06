// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../../../src/firebase"; // Ensure this path is correct

const auth = getAuth(app);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        try {
          // Fetch existing sign-in methods for the user's email
          const existingMethods = await fetchSignInMethodsForEmail(
            auth,
            profile.email
          );

          // Check if Google provider is already linked
          if (!existingMethods.includes(GoogleAuthProvider.PROVIDER_ID)) {
            // If the user is already authenticated, link the Google provider
            if (auth.currentUser) {
              // Use signInWithPopup to retrieve the Google credentials
              const googleProvider = new GoogleAuthProvider();
              const result = await signInWithPopup(auth, googleProvider);

              // Extract AuthCredential from the result
              const googleCredential =
                GoogleAuthProvider.credentialFromResult(result);

              if (googleCredential) {
                try {
                  // Link the Google credentials to the current user
                  await linkWithCredential(auth.currentUser, googleCredential);
                  console.log("Successfully linked Google account.");
                } catch (linkError) {
                  console.error("Error linking Google account:", linkError);
                }
              } else {
                console.error("Failed to obtain Google credentials.");
              }
            } else {
              console.error("User not authenticated. Cannot link Google.");
            }
          }
        } catch (error) {
          console.error("Error ensuring account creation:", error);
        }

        // Return the profile as NextAuth expects
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Sign in with Firebase Auth using email and password
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials?.email || "",
            credentials?.password || ""
          );

          const existingProviders = await fetchSignInMethodsForEmail(
            auth,
            credentials?.email || ""
          );

          // Check if Google is an existing provider and link accounts
          if (
            existingProviders.includes(GoogleAuthProvider.PROVIDER_ID) &&
            auth.currentUser
          ) {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);

            // Extract AuthCredential from the result
            const googleCredential =
              GoogleAuthProvider.credentialFromResult(result);

            if (googleCredential) {
              try {
                await linkWithCredential(auth.currentUser, googleCredential);
                console.log("Successfully linked Google account.");
              } catch (linkError) {
                console.error("Error linking Google account:", linkError);
              }
            } else {
              console.error("Failed to obtain Google credentials.");
            }
          }

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName || userCredential.user.email,
          };
        } catch (error) {
          console.error("Error during account linking:", error);
          throw new Error("Failed to authenticate. Please try again.");
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  }) as any,

  // Callbacks to include uid in the session and JWT
  callbacks: {
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token?.uid) {
        session.user.id = token.uid;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
