'use client';

import { cn } from '@/shared/lib';
import React from 'react';
import { Title } from './Title';
import { Button } from '@/shared/components/ui';

interface Props {
  imageUrl: string;
  name: string;
  item?: any[];
  price: number;
  onSubmit: VoidFunction;
  className?: string;
}

/**
 * Форма выбора продукта
 */
export const ChooseProductForm: React.FC<Props> = ({
  imageUrl,
  name,
  item,
  price,
  onSubmit,
  className,
}) => {
  
  return (
    <div className={cn(className, 'flex flex-1')}>
      {/* <ProductImage imageUrl={imageUrl} size={30} /> */}

      <div className="flex items-center justify-center flex-1 w-full">
        <img
          src={imageUrl}
          alt={name}
          className="relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]"
        />
      </div>

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <Button onClick={onSubmit} className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
          Добавить в корзину за {price} ₽
        </Button>
      </div>
    </div>
  );
};
