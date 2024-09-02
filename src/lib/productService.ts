import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";

export async function fetchProducts() {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        category: data.category || '',
        discountType: data.discountType || '',
        expirationDate: data.expirationDate || '',
        itemNumber: data.itemNumber || '',
        name: data.name || ''
      };
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
