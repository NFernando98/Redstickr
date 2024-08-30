"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"

const formSchema = z.object({
    productName: z.string().min(1, "Product Name is required"),
    expirationDate: z.date().nullable(),
    category: z.string().min(1, "Category is required"),
});

export default function ProfileForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            expirationDate: null,
            category: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.toISOString() : null,
            };
            console.log(formattedValues);

            const { productName, expirationDate, category } = formattedValues;

            const docRef = await addDoc(collection(db, "products"), {
                productName,
                expirationDate,
                category,
            });

            console.log("Document written with ID: ", docRef.id);
            // Optionally, you can reset the form after successful submission
            form.reset(); // Assuming `form` object has a reset function

        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    console.log(form.formState.errors); // Debugging line to see validation errors

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <FormField
                    control={form.control}
                    name="productName"
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
                        <FormItem>
                            <FormLabel>Expiration Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className="w-full text-left font-normal"
                                            onClick={() => field.onChange(field.value)}
                                        >
                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ?? undefined} // Use undefined if field.value is null
                                        onSelect={(date) => field.onChange(date)}
                                        disabled={(date) => date < new Date()}
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
                            <Select onValueChange={(value) => field.onChange(value)}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="toys">Toys</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="beauty">Beauty</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
