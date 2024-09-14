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
    [category: string]: {
        [discountType: string]: Product[];
    };
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

            // Filter out expired products
            const expiredProducts = productsList.filter(product => {
                const expirationDate = isTimestamp(product.expirationDate)
                    ? product.expirationDate.toDate()
                    : new Date(product.expirationDate);
                return expirationDate < now;
            });

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
        <Navbar>
            <h1 className="text-4xl font-bold mb-6">Expired Items</h1>
            <div className="mt-8"> {/* Add vertical space here */}
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
            </div>
        </Navbar>
    );
}