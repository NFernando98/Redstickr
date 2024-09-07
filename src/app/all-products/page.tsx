'use client';

import Navbar from '@/components/Navbar';
import AddProductModal from '@/components/AddProductModal';
import ProductList from '@/components/ProductList';

export default function ProductListPage() {
  return (
    <Navbar>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">All Products</h1>
        <AddProductModal /> {/* No need to pass refresh handler */}
      </div>
      <ProductList /> 
    </Navbar>
  );
}
