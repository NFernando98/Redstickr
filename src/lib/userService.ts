import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Function to get user ID from session token
export async function getUserIdFromSession(
  sessionToken: string
): Promise<string> {
  const q = query(
    collection(db, "sessions"),
    where("sessionToken", "==", sessionToken)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Session not found");
  }

  const sessionDoc = querySnapshot.docs[0].data();
  return sessionDoc.userId;
}

export async function fetchUserId(sessionToken: string): Promise<string> {
  try {
    const userId = await getUserIdFromSession(sessionToken);
    return userId;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    throw error; // Re-throw the error to handle it at the calling function
  }
}

