import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    expirationDate: string;
    discountType: string;
    itemNumber: string;
    imageUrl?: string;
  };
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const isExpired = new Date(product.expirationDate) < new Date();
  const expirationDate = new Date(product.expirationDate);
  const daysLeft = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  const getDiscountColor = (discountType: string) => {
    switch (discountType) {
      case '20% Off': return 'bg-yellow-500';
      case '35% Off': return 'bg-orange-500';
      case '50% Off': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`mb-4 ${isExpired ? 'border-red-500' : getDiscountColor(product.discountType)}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{product.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex">
          <img src={product.imageUrl || '/placeholder-image.jpg'} alt={product.name} className="w-1/3 h-auto object-cover mr-4"/>
          <div className="flex-1">
            <p className="font-bold text-lg mb-1">{expirationDate.toLocaleDateString()}</p>
            <p className="text-sm mb-1">{product.itemNumber}</p>
            {isExpired ? <p className="text-red-500 font-bold">EXPIRED</p> : <p className="text-sm mb-2">{daysLeft} days left</p>}
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">Delete</Button>
              <Button variant="secondary" size="sm">Update</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;