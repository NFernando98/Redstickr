"use client";

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Product } from '../types/product';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react'; // Import useSession from next-auth

interface GroupedProducts {
    [category: string]: {
        [discountType: string]: Product[];
    };
}

export default function ProductList() {
    const { data: session } = useSession(); // Get session data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!session?.user?.email) {
            setLoading(false);
            return;
        }

        const userEmail = session.user.email;

        // Query products for the logged-in user's email
        const productsQuery = query(collection(db, "products"), where("userEmail", "==", userEmail));

        // Set up a real-time listener
        const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(productsList);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [session?.user?.email]);

    if (loading) {
        return <div>Loading products...</div>;
    }

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
