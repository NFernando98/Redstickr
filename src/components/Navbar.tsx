'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { signOut, useSession } from 'next-auth/react';
import { listenToExpiringProducts } from '@/utils/fetchExpiringProducts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FiBell } from 'react-icons/fi';
import NotificationContent from './NotificationContent';

interface NavbarProps {
  children: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [productDiscountTypeToUpdate, setProductDiscountTypeToUpdate] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribe: any;

    if (session?.user?.id) {
      // Start listening to expiring products for the logged-in user
      unsubscribe = listenToExpiringProducts(session.user.id, (products) => {
        // Filter products needing discount updates
        const productsNeedingUpdate = products.filter(
          (product) => product.needsDiscountUpdate
        );
        setProductDiscountTypeToUpdate(productsNeedingUpdate);
      });
    }

    // Clean up the listener when the component unmounts or user logs out
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-4xl font-bold text-white">Red</span>
                  <span className="text-4xl font-bold text-red-600">Sticker</span>
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                {session ? (
                  <>
                    <Link href="/expired-products" className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium text-white">
                      Expired Products
                    </Link>
                    <Link href="/all-products" className="inline-flex items-center px-1 pt-1 border-b-2 text-xl font-medium text-white">
                      All Products
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="mr-4 text-white">{session.user?.email}</span>

                  {/* Popover for Notifications */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="text-xl text-white relative">
                        <FiBell size={24} /> {/* Bell Icon */}
                        {productDiscountTypeToUpdate.length > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                          >
                            {productDiscountTypeToUpdate.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <NotificationContent></NotificationContent>
                  </Popover>

                  <Button onClick={() => signOut({ callbackUrl: '/' })} variant="ghost" className="text-xl text-white">
                    Log out
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" className="text-xl text-white">
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
