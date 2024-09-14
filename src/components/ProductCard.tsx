import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddProductModal from './AddProductModal';
import { Timestamp } from 'firebase/firestore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    expirationDate: Timestamp | string; // Allow both Timestamp and string
    discountType: string;
    itemNumber: string;
    imageUrl?: string;
    category: string;
  };
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  // Convert Firestore Timestamp to JavaScript Date if needed
  const expirationDate = typeof product.expirationDate === 'string'
    ? new Date(product.expirationDate)
    : product.expirationDate.toDate(); // Assuming it's a Firestore Timestamp

  const isExpired = expirationDate < new Date();
  const daysLeft = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  const getDiscountColor = (discountType: string) => {
    switch (discountType) {
      case '20% Off': return 'bg-yellow-500';
      case '35% Off': return 'bg-orange-500';
      case '50% Off': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  async function onDelete() {
    if (!product || !product.id) return;

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Network response was not ok');

    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <Card className={`mb-4 ${isExpired ? 'border-red-500' : ''}`}>
      <CardHeader>
        <CardTitle className="font-bold text-lg mb-1 flex justify-between items-center">
          <span>{product.name}</span>
          <Badge className={`text-center ${getDiscountColor(product.discountType)}`}>
            {product.discountType.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex">
          <img src={product.imageUrl || '/placeholder-image.jpg'} alt={product.name} className="w-1/3 h-auto object-cover mr-4" />
          <div className="flex-1">
            <p className="font-bold text-md mb-1">{expirationDate.toLocaleDateString()}</p>
            <p className="text-sm mb-1">{product.itemNumber}</p>
            {isExpired ? "" : <p className="text-sm mb-2">{daysLeft} days left</p>}
            <div className="flex space-x-2">
              {/* <Button variant="secondary" size="sm">Delete</Button> */}
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
              {product.discountType !== "expired" && <AddProductModal product={product} />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
