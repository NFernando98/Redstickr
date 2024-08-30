import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function DogPage() {
  const filteredProducts = [
    { id: "1", name: "Acana Red Meat 4.4 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103536", category: "Dog" },
    { id: "2", name: "Acana Ranchlands 4.4 lbs", expirationDate: "10/30/2024", discountType: "35% Off", itemNumber: "11035367", category: "Dog" },
    { id: "3", name: "Acana Wild Coast 4.4 lbs", expirationDate: "11/30/2024", discountType: "20% Off", itemNumber: "1103538", category: "Dog" },
    { id: "4", name: "Acana Kitten 2.5 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103539", category: "Cat" },
    { id: "5", name: "Martin Little Friends 5 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103540", category: "Small Animal" },
    { id: "6", name: "Tetra Goldfish Fish Food 1 oz", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103541", category: "Fish" },
    { id: "7", name: "Health Diet Parakeet Food 2.2 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103542", category: "Bird" },
    { id: "8", name: "Zoo Med Cricket Block", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103543", category: "Reptile" }
  ]

  const categories = ['Dog', 'Cat', 'Small Animal', 'Bird', 'Fish', 'Reptile']

  const groupedProducts = {
    '50% Off': filteredProducts.filter(p => p.discountType === '50% Off'),
    '35% Off': filteredProducts.filter(p => p.discountType === '35% Off'),
    '20% Off': filteredProducts.filter(p => p.discountType === '20% Off'),
  };

  return (
    <Navbar>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Expiring Items</h1>
        <Button variant="outline">+ Add Item</Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {categories.map(category => (
          <AccordionItem key={category} value={category} className="text-3xl font-bold mb-4">
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              {Object.entries(groupedProducts).map(([discountType, products]) => (
                <div key={discountType} className='mb-2'>
                  <h2 className="text-2xl font-semibold mb-2">{discountType}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products
                    .filter(product => product.category === category)
                    .map(product => (
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