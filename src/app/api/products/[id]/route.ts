import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure the path is correct

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await request.json();
        const productRef = doc(db, "products", id);

        // Check if the document exists
        const docSnap = await getDoc(productRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Only update the fields that are provided in the request
        const updateData: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                updateData[key] = key === 'expirationDate' ? new Date(value as string) : value;
            }
        }

        await updateDoc(productRef, updateData);

        return NextResponse.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating document:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const productRef = doc(db, "products", id);

        // Check if the document exists
        const docSnap = await getDoc(productRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await deleteDoc(productRef);

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}