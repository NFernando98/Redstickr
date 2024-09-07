import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure the path is correct

interface ProductData {
  name: string;
  expirationDate: string; // ISO date string
  category: string;
  itemNumber: string;
  discountType: string;
  imageUrl: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      expirationDate,
      category,
      itemNumber,
      discountType,
      imageUrl,
      userId,
    }: ProductData = await request.json();

    const productData = {
      name,
      expirationDate: Timestamp.fromDate(new Date(expirationDate)), // Convert to Firestore Timestamp
      category,
      itemNumber,
      discountType,
      imageUrl,
      userId,
    };

    await addDoc(collection(db, "products"), productData);

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.error();
  }
}
