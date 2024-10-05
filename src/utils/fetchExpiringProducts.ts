import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

export const listenToExpiringProducts = (
  userId: string,
  callback: (products: any[]) => void
) => {
  if (!userId) return;

  const productsRef = collection(db, "products");
  const currentDate = Timestamp.now();
  const ninetyDaysFromNow = new Timestamp(
    currentDate.seconds + 90 * 24 * 60 * 60,
    0
  ); // Add 90 days

  // Firestore query to get products expiring in the next 90 days for the logged-in user
  const q = query(
    productsRef,
    where("userId", "==", userId),
    where("expirationDate", ">=", currentDate),
    where("expirationDate", "<=", ninetyDaysFromNow) // Get products expiring within 90 days
  );

  // Listen for real-time updates on this query
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const expiringProducts = querySnapshot.docs.map((doc) => {
      const product = doc.data();

      // Calculate how many days remain until expiration
      const expirationDate = product.expirationDate.toDate();
      const daysUntilExpiration = Math.floor(
        (expirationDate.getTime() - currentDate.toDate().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Determine the expected discount based on the days until expiration
      let expectedDiscount = "";
      if (daysUntilExpiration <= 30) {
        expectedDiscount = "50% Off";
      } else if (daysUntilExpiration > 30 && daysUntilExpiration <= 60) {
        expectedDiscount = "35% Off";
      } else if (daysUntilExpiration > 60 && daysUntilExpiration <= 90) {
        expectedDiscount = "20% Off";
      }

      // Return the product data along with daysUntilExpiration and expectedDiscount
      return {
        ...product,
        daysUntilExpiration,
        expectedDiscount, // This will help flag any mismatches on the frontend
        needsDiscountUpdate: product.discountType !== expectedDiscount, // Flag if the discount needs an update
      };
    });

    // this has all of the above return values that is sent to client side
    callback(expiringProducts); // Trigger the callback with the updated product list
  });

  // Return the unsubscribe function to stop listening when not needed
  return unsubscribe;
};
