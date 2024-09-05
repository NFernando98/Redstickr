import React from 'react'
import Navbar from '@/components/Navbar'
import ProductCard from "@/components/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HomePage() {
  const categories = ['Dog', 'Cat', 'Small Animal', 'Bird', 'Fish', 'Reptile']

  const expiredProducts = [
    { id: "1", name: "Acana Red Meat 4.4 lbs", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103536", category: "Dog" },
    { id: "2", name: "Acana Ranchlands 4.4 lbs", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "11035367", category: "Dog" },
    { id: "3", name: "Acana Wild Coast 4.4 lbs", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103538", category: "Dog" },
    { id: "4", name: "Acana Kitten 2.5 lbs", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103539", category: "Cat" },
    { id: "5", name: "Martin Little Friends 5 lbs", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103540", category: "Small Animal" },
    { id: "6", name: "Tetra Goldfish Fish Food 1 oz", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103541", category: "Fish" },
    { id: "7", name: "Health Diet Parakeet Food 2.2 lbs", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103542", category: "Bird" },
    { id: "8", name: "Zoo Med Cricket Block", expirationDate: "08/29/2024", discountType: "expired", itemNumber: "1103543", category: "Reptile" }
  ]

  return (
    <Navbar>
      <h1 className="text-4xl font-bold mb-6">Expired Items</h1>
      <Accordion type="single" collapsible className="w-full">
        {categories.map(category => (
          <AccordionItem key={category} value={category} className="text-3xl font-bold mb-4">
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expiredProducts
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
  )
}
