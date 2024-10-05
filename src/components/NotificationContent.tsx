import React, { useEffect, useState } from 'react';
import { PopoverContent } from "@/components/ui/popover";
import { listenToExpiringProducts } from '@/utils/fetchExpiringProducts';
import { useSession } from 'next-auth/react';

export default function NotificationContent() {
    const { data: session, status } = useSession();
    const [productDiscountTypeToUpdate, setProductDiscountTypeToUpdate] = useState<any[]>([]);

    useEffect(() => {
        let unsubscribe: any;

        if (session?.user?.id) {
            // Start listening to expiring products for the logged-in user
            unsubscribe = listenToExpiringProducts(session.user.id, (products) => {
                // Filter products needing discount updates
                const productsNeedingUpdate = products.filter((product) => product.needsDiscountUpdate);

                setProductDiscountTypeToUpdate(productsNeedingUpdate); // Store only those needing updates

                console.log("Expiring Products: ", products);
                console.log("Products Needing Update: ", productsNeedingUpdate);
            });
        }

        // Clean up the listener when the component unmounts or user logs out
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [session]);

    return (
        <div>
            <PopoverContent className="w-96 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                {/* Show products needing discount updates */}
                <h3 className="text-xl font-bold text-gray-900">Product Stickers to Update</h3>

                {productDiscountTypeToUpdate.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                        {productDiscountTypeToUpdate.map((product, index) => (
                            <li
                                key={index}
                                className="bg-yellow-50 p-4 text-yellow-700 border border-yellow-300 rounded-lg flex justify-between items-center"
                            >
                                <div className="font-medium text-gray-700">
                                    {product.name} <span className="text-gray-500">({product.category})</span>
                                </div>
                                <div className="text-right text-gray-600">
                                    <div>Current: {product.discountType}</div>
                                    <div className="text-red-600">Should be: {product.expectedDiscount}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-gray-500">No products need discount updates.</p>
                )}
            </PopoverContent>

        </div>
    );
}
