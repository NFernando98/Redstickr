"use client";

import { FC, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";

const UserIdLogger: FC = () => {
  const { data: session } = useSession();

  // Filter accounts collection by email
  const [accounts, loadingAccounts, errorAccounts] = useCollection(
    session?.user?.email
      ? query(
          collection(db, "accounts"),
          where("email", "==", session.user.email)
        )
      : null
  );

  useEffect(() => {
    if (session?.user?.email) {
      console.log("Session User Email:", session.user.email);

      if (!loadingAccounts && accounts) {
        if (accounts.docs.length > 0) {
          const accountData = accounts.docs[0].data();
          if (accountData.userId) {
            console.log("Account User ID:", accountData.userId);
          } else {
            console.log("User ID not found in account data.");
          }
        } else {
          console.log("No accounts found for this user.");
        }
      }
    }
  }, [session, loadingAccounts, accounts]);

  return null;
};

export default UserIdLogger;
