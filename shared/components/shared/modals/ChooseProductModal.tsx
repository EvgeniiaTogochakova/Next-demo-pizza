'use client';

import React from 'react';
import { cn } from '@/shared/lib';
import { ProductWithRelations } from '@/@types/prisma-types';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ChoosePizzaForm, ChooseProductForm } from '@/shared/components/shared';
import { useCartStore } from '@/shared/store';
import toast from 'react-hot-toast';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const firstItem = product.items[0];
  const isPizzaForm = Boolean(firstItem.pizzaType);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  
  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      if (isPizzaForm){
        await addCartItem({
          productItemId,
          ingredients,
        });
      } else{
        await addCartItem({
          productItemId: firstItem.id,
        })
      }
      
      toast.success(product.name + ' уже в корзине');
      router.back();
    } catch (err) {
      toast.error('Не удалось добавить в корзину ' + product.name);
      console.error(err);
    }
    
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden',
          className,
        )}>
        {isPizzaForm ? (
          <ChoosePizzaForm
            onSubmit={onSubmit}
            imageUrl={product.imageUrl}
            name={product.name}
            ingredients={product.ingredients}
            items={product.items}
            loading={loading}
          />
        ) : (
          <ChooseProductForm
            onSubmit={onSubmit}
            imageUrl={product.imageUrl}
            name={product.name}
            price={firstItem.price}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
