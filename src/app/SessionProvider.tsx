'use client';

import { SessionProvider as NextAuthProvider } from 'next-auth/react';

const SessionProvider = ({ session, children }: { session: any, children: React.ReactNode }) => {
    return <NextAuthProvider session={session}>{children}</NextAuthProvider>;
};

export default SessionProvider;
