import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "./ProductForm";
import { Timestamp } from 'firebase/firestore';

interface AddProductModalProps {
  product?: {
    id: string;
    name: string;
    expirationDate: Timestamp | string;
    discountType: string;
    itemNumber: string;
    imageUrl?: string;
    category: string;
  };
}

export default function AddProductModal({ product }: AddProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleFormSubmit = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {product ? (<Button variant="secondary" size="sm">Update</Button>) :
          (<Button variant="default">+ Add New Product</Button>)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Update Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <ProductForm product={product} onSubmitSuccess={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}