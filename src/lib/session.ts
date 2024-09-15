// lib/session.ts
import { useSession as useNextAuthSession } from "next-auth/react"; // Import the built-in hook
import { Session } from "next-auth";

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  sessionToken?: string; // Ensure sessionToken is part of the session
}

// Export a function to use the custom session
export function useSession() {
  const { data, status } = useNextAuthSession(); // Use the built-in useSession hook
  return { data: data as CustomSession | null, status };
}
