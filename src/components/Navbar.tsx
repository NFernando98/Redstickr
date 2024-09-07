'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface NavbarProps {
  children: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ children }) => {
  const { data: session, status } = useSession();

  // Handle unauthenticated state with redirect
  if (status === 'unauthenticated') {
    redirect('/sign-in'); // Redirect to sign-in page if not authenticated
  }

  // Loading state to avoid flickering or flashing before session is ready
  if (status === 'loading') {
    return <div>Loading...</div>; // Show a loading indicator until session status is resolved
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-4xl font-bold text-black-600">Red</span>
                  <span className="text-4xl font-bold text-red-600">Sticker</span>
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link href="/expired-products" className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium">
                  Expired Products
                </Link>
                <Link href="/all-products" className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium">
                  All Products
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {session ? (
                <>
                  <span className="mr-4">{session.user?.email}</span>
                  <Button onClick={() => signOut({ callbackUrl: '/sign-in' })} variant="ghost" className="text-xl">
                    Log out
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" className="text-xl">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Navbar;
