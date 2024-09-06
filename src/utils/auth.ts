import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  AuthError,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { app } from "../firebase";

// Initialize Firebase Auth
const auth = getAuth(app);

// Google Sign-In
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in successful:", result.user);
  } catch (error: unknown) {
    handleAuthError(error);
  }
}

// Email/Password Sign-In
export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Email/Password sign-in successful:", result.user);
  } catch (error: unknown) {
    handleAuthError(error);
  }
}

// Link Email/Password account
export async function linkEmailPasswordAccount(
  email: string,
  password: string,
  googleCredential: any
) {
  const credential = EmailAuthProvider.credential(email, password);
  try {
    const user = auth.currentUser;
    if (user) {
      const result = await linkWithCredential(user, credential);
      console.log("Accounts linked successfully!", result.user);
    }
  } catch (error: unknown) {
    handleAuthError(error);
  }
}

// Link Google account to existing email/password
export async function linkGoogleAccount(emailCredential: any) {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Accounts linked successfully!", result.user);
  } catch (error: unknown) {
    handleAuthError(error);
  }
}

// Handle Firebase Auth Errors
function handleAuthError(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const firebaseError = error as {
      code: string;
      customData?: { email?: string };
    };
    console.error(`Firebase error code: ${firebaseError.code}`, firebaseError);
    if (
      firebaseError.code === "auth/account-exists-with-different-credential"
    ) {
      // Handle specific error, such as prompting for linking credentials
      console.error("Handle account linking here.");
    }
  } else if (error instanceof Error) {
    console.error("General error:", error.message);
  } else {
    console.error("Unhandled error type:", error);
  }
}
