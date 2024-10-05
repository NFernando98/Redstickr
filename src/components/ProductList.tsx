"use client";

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Product } from '../types/product';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react'; // Import useSession from next-auth
import SearchBar from '@/components/SearchBar';

interface GroupedProducts {
    [category: string]: Product[];
}

export default function ProductList() {
    const { data: session } = useSession(); // Get session data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        // Check if the user is logged in and has a userId
        const userId = session?.user?.id;

        if (!userId) {
            setLoading(false);
            return;
        }

        // Query products for the logged-in user's userId
        const productsQuery = query(collection(db, "products"), where("userId", "==", userId));

        // Set up a real-time listener
        const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
            setProducts(productsList);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [session?.user?.id]);

    if (loading) {
        return <div>Loading products...</div>;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedProducts: GroupedProducts = filteredProducts.reduce((acc: GroupedProducts, product) => {
        const { category, discountType } = product;

        if (discountType.toLowerCase() === "expired") {
            return acc;
        }

        if (!acc[category]) {
            acc[category] = [];
        }

        acc[category].push(product);

        return acc;
    }, {} as GroupedProducts);

    const categories = Object.keys(groupedProducts);

    return (
        <div>
            <div className="mb-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>
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
            {categories.length === 0 && (
                <p className="text-center text-gray-500">No products found matching your search.</p>
            )}
        </div>
    );
}
