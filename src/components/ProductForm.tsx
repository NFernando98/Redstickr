'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
    name: z.string().min(1, 'Product Name is required'),
    expirationDate: z.date(),
    category: z.string().min(1, 'Category is required'),
    itemNumber: z.string().min(1, 'Item Number is required'),
    discountType: z.string().min(1, 'Discount Type is required'),
    imageUrl: z.string(),
});

interface ProductFormProps {
    onSubmitSuccess?: () => void;
}

export default function ProductForm({ onSubmitSuccess }: ProductFormProps) {
    const { data: session, status } = useSession();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(status === 'loading');

    useEffect(() => {
        if (status === 'loading') return;
        setUserId(session?.user?.id ?? null);
        setLoading(false);
    }, [session, status]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            expirationDate: new Date(),
            category: '',
            itemNumber: '',
            discountType: '',
            imageUrl: '',
        },
    });

    if (loading) return <div>Loading authentication state...</div>;

    if (!userId) return <div>User not logged in</div>;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!userId) return console.error('User ID is not available');

        const productData = {
            ...values,
            expirationDate: Timestamp.fromDate(values.expirationDate), // Convert to Firestore Timestamp
            userId,
        };

        try {
            await addDoc(collection(db, 'products'), productData);
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Expiration Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            if (date) {
                                                field.onChange(date);
                                            }
                                        }}
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Dog">Dog</SelectItem>
                                    <SelectItem value="Cat">Cat</SelectItem>
                                    <SelectItem value="Small Animal">Small Animal</SelectItem>
                                    <SelectItem value="Bird">Bird</SelectItem>
                                    <SelectItem value="Fish">Fish</SelectItem>
                                    <SelectItem value="Reptile">Reptile</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="itemNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter item number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a discount type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="20% Off">20% Off</SelectItem>
                                    <SelectItem value="35% Off">35% Off</SelectItem>
                                    <SelectItem value="50% Off">50% Off</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Image</FormLabel>
                            <FormControl>
                                <Input id="picture" type="file" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading || !userId}>
                    {loading ? "Loading..." : "Add Product"}
                </Button>
            </form>
        </Form>
    );
}
