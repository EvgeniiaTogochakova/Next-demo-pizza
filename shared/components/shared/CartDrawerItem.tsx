'use client';

import React from 'react';
import { cn } from '@/shared/lib';
import * as CartItem from '@/shared/components/shared/cart-item-details';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import { Trash2Icon } from 'lucide-react';

interface Props extends CartItemProps {
  onClickCountButton?: (type: 'plus' | 'minus') => void;
  className?: string;
}

export const CartDrawerItem: React.FC<Props> = ({
  id,
  imageUrl,
  details,
  name,
  price,
  quantity,
  onClickCountButton,
  className,
}) => {
  return (
    <div className={className}>
      <div className={cn('flex bg-white p-5 gap-6', className)}>
        <CartItem.Image src={imageUrl} />

        <div className="flex-1">
          <CartItem.Info name={name} details={details} />
          <hr className="my-3" />
          <div className="flex items-center justify-between">
            {/* <CartItem.CountButton onClick={(type) => console.log(type)} value={quantity} /> */}
            <CartItem.CountButton onClick={onClickCountButton} value={quantity} />
            <div className="flex items-center gap-3">
              <CartItem.Price value={price} />
              <Trash2Icon className="text-gray-400 cursor-pointer hover:text-gray-600" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
