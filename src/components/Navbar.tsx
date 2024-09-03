'use client'

import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { signOut, useSession } from 'next-auth/react'

interface NavbarProps {
  children: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ children }) => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      {session?.data?.user?.name}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-4xl font-bold text-black-600">Red</span><span className="text-4xl font-bold text-red-600">Sticker</span>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium">
                  Expired Items
                </Link>
                <Link href="/allproducts" className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium">
                  All Products
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={() => signOut()} variant="ghost" className="text-xl">Log out</Button>
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