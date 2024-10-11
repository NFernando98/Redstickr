// src/components/ProductForm.tsx
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
import { useSession } from 'next-auth/react';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';
import imageCompression from 'browser-image-compression';

const formSchema = z.object({
    name: z.string().min(1, 'Product Name is required'),
    expirationDate: z.date(),
    category: z.string().min(1, 'Category is required'),
    itemNumber: z.string().min(1, 'Item Number is required'),
    discountType: z.string().min(1, 'Discount Type is required'),
    imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    product?: {
        id: string;
        name: string;
        expirationDate: Timestamp | string;
        discountType: string;
        itemNumber: string;
        imageUrl?: string;
        category: string;
    };
    onSubmitSuccess?: () => void;
}

export default function ProductForm({ product, onSubmitSuccess }: ProductFormProps) {
    const { data: session, status } = useSession();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (status === 'loading') return;
        setUserId(session?.user?.id ?? null);
        setLoading(false);
    }, [session, status]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product?.name || "",
            expirationDate: typeof product?.expirationDate === 'string'
                ? new Date(product?.expirationDate)
                : product?.expirationDate.toDate(),
            category: product?.category || "",
            itemNumber: product?.itemNumber || "",
            discountType: product?.discountType || "",
            imageUrl: product?.imageUrl || "",
        },
    });

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    async function resizeImage(file: File, width: number, height: number): Promise<File> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (event) => {
                img.src = event.target?.result as string;
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Draw the resized image on the canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert the canvas to a Blob
                    canvas.toBlob((blob) => {
                        if (blob) {
                            // Convert Blob to File
                            const resizedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(resizedFile);
                        } else {
                            reject(new Error("Canvas to Blob conversion failed."));
                        }
                    }, file.type);
                }
            };

            reader.readAsDataURL(file);
        });
    }

    // Upload image to Firebase Storage
    async function uploadImage(file: File) {
        try {
            // Resize the image to 200x200
            const resizedFile = await resizeImage(file, 200, 200);

            // Options for image compression
            const options = {
                maxSizeMB: 1,
                useWebWorker: true,
            };

            // Compress the image
            const compressedFile = await imageCompression(resizedFile, options);

            // Upload the compressed image to Firebase Storage
            const storageRef = ref(storage, `products/${compressedFile.name}`);
            await uploadBytes(storageRef, compressedFile);

            // Get the download URL for the uploaded image
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error uploading the image:", error);
            throw error;
        }
    }

    if (loading) return <div>Loading authentication state...</div>;
    if (!userId) return <div>User not logged in</div>;

    // Form submission
    async function onSubmit(values: FormValues) {
        if (!userId) return console.error('User ID is not available');

        let imageUrl = '';
        if (imageFile) {
            imageUrl = await uploadImage(imageFile); // Upload the image and get the URL
        }

        try {
            const url = product ? `/api/products/${product.id}` : '/api/products';
            const method = product ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, userId, imageUrl }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            if (onSubmitSuccess) onSubmitSuccess(); // Close the modal
        } catch (error) {
            console.error('Error submitting product:', error);
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
                                    {product ? <SelectItem value="expired">Expired</SelectItem> : ""}
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
                                <Input id="picture" type="file" onChange={handleImageChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">{product ? 'Update Product' : 'Add Product'}</Button>
            </form>
        </Form>
    );
}
