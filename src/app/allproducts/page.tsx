// imports fetchProduct method that retrieves data from firebase
import { fetchProducts } from '@/lib/productService';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AddProductModal from '@/components/AddProductModal';

interface Product {
  id: string;
  category: string;
  discountType: string;
  expirationDate: string;
  itemNumber: string;
  name: string;
}

interface GroupedProducts {
  [category: string]: {
    [discountType: string]: Product[];
  };
}

export default async function ProductListPage() {
  const products: Product[] = await fetchProducts();

  // Group products by category and discountType
  const groupedProducts: GroupedProducts = products.reduce((acc: GroupedProducts, product) => {
    const { category, discountType } = product;

    if (!acc[category]) {
      acc[category] = {};
    }

    if (!acc[category][discountType]) {
      acc[category][discountType] = [];
    }

    acc[category][discountType].push(product);

    return acc;
  }, {} as GroupedProducts); 

  const categories = Object.keys(groupedProducts);

  return (
    <Navbar>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">All Products</h1>
        <AddProductModal />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {categories.map(category => (
          <AccordionItem key={category} value={category} className="text-3xl font-bold mb-4">
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              {Object.entries(groupedProducts[category]).map(([discountType, products]) => (
                <div key={discountType} className='mb-2'>
                  <h2 className="text-2xl font-semibold mb-2">{discountType}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {products.length === 0 && (
                    <p className="text-center text-gray-500 mt-2">No products in this category.</p>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Navbar>
  );
}
