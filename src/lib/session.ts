// lib/session.ts
import { useSession as useNextAuthSession } from "next-auth/react"; // Import the built-in hook
import { Session } from "next-auth";

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface CustomSession extends Session {
  user?: User;
  sessionToken?: string; // Ensure sessionToken is part of the session
}

export function useSession() {
  const { data, status } = useNextAuthSession(); // Use the built-in useSession hook
  return { data: data as CustomSession | null, status };
}
