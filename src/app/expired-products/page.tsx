'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Product } from '../../types/product';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react'; // Import useSession from next-auth
import Navbar from '@/components/Navbar';

// Type guard to check if a value is an instance of Timestamp
const isTimestamp = (date: any): date is Timestamp => {
    return date instanceof Timestamp;
};

interface GroupedProducts {
    [category: string]: Product[];
}

export default function ProductList() {
    const { data: session } = useSession(); // Get session data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const userId = session?.user?.id;

        if (!userId) {
            setLoading(false);
            return;
        }

        // Get current timestamp
        const now = new Date();

        // Query for products
        const productsQuery = query(
            collection(db, "products"),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
            const productsList = snapshot.docs.map(doc => {
                const data = doc.data() as Product;
                // Return the product with the id assigned explicitly
                return { ...data, id: doc.id };
            });

            // Filter for products with discount type "expired"
            const expiredProducts = productsList.filter(product => 
                product.discountType.toLowerCase() === "expired"
            );

            console.log('Fetched Products:', expiredProducts);
            setProducts(expiredProducts);
            setLoading(false);
        }, (error) => {
            console.error('Error retrieving products:', error);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [session?.user?.id]);

    if (loading) {
        return <div>Loading products...</div>;
    }

    // Group expired products by category
    const groupedProducts: GroupedProducts = products.reduce((acc: GroupedProducts, product) => {
        const { category } = product;

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(product);

        return acc;
    }, {} as GroupedProducts);

    const categories = Object.keys(groupedProducts);

    return (
        <Navbar>
            <h1 className="text-4xl font-bold mb-6">Expired Items</h1>
            <div className="mt-8">
                <Accordion type="single" collapsible className="w-full">
                    {categories.map(category => (
                        <AccordionItem key={category} value={category} className="text-3xl font-bold mb-4">
                            <AccordionTrigger>{category}</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {groupedProducts[category].map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </Navbar>
    );
}
