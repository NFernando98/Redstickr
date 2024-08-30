import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Navbar: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-black-600">Red</span><span className="text-2xl font-bold text-red-600">Sticker</span>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Expired Items
                </Link>
                <Link href="/allproducts" className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  All Products
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost">Log out</Button>
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