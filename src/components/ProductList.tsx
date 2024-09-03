"use client";

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Product } from '../types/product';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

interface GroupedProducts {
    [category: string]: {
        [discountType: string]: Product[];
    };
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Set up a real-time listener
        const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(productsList);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Group products by category and discount type
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
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
