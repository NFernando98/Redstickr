"use client";

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AddProductModal from '@/components/AddProductModal';

export default function AllProducts() {
  const filteredProducts = [
    { id: "1", name: "Acana Red Meat 4.4 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103536", category: "Dog", imageUrl: "" },
    { id: "2", name: "Acana Ranchlands 4.4 lbs", expirationDate: "10/30/2024", discountType: "35% Off", itemNumber: "11035367", category: "Dog", imageUrl: "" },
    { id: "3", name: "Acana Wild Coast 4.4 lbs", expirationDate: "11/30/2024", discountType: "20% Off", itemNumber: "1103538", category: "Dog", imageUrl: "" },
    { id: "4", name: "Acana Kitten 2.5 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103539", category: "Cat" },
    { id: "5", name: "Martin Little Friends 5 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103540", category: "Small Animal", imageUrl: "" },
    { id: "6", name: "Tetra Goldfish Fish Food 1 oz", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103541", category: "Fish", imageUrl: "" },
    { id: "7", name: "Health Diet Parakeet Food 2.2 lbs", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103542", category: "Bird", imageUrl: "" },
    { id: "8", name: "Zoo Med Cricket Block", expirationDate: "09/30/2024", discountType: "50% Off", itemNumber: "1103543", category: "Reptile", imageUrl: "" }
  ]

  const categories = ['Dog', 'Cat', 'Small Animal', 'Bird', 'Fish', 'Reptile']

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts
                  .filter(product => product.category === category)
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Navbar>
  );
}