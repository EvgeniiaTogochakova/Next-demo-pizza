'use client';

import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';
import React from 'react';

interface Props {
  className?: string;
}

// const categories = ['Пиццы', 'Комбо', 'Закуски', 'Коктейли', 'Кофе', 'Напитки', 'Десерты', 'Еще'];

const categories = [
  { id: 1, name: 'Пиццы' },
  { id: 2, name: 'Комбо' },
  { id: 3, name: 'Закуски' },
  { id: 4, name: 'Коктейли' },
  { id: 5, name: 'Кофе' },
  { id: 6, name: 'Напитки' },
  { id: 7, name: 'Десерты' },
  { id: 8, name: 'Еще' },
];

// const activeIndex = 0;

export const Categories: React.FC<Props> = ({ className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);

  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {/* {categories.map((category, index) => ( */}
      {categories.map(({ id, name }, index) => (
        <a href={`/#${name}`}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5',
            // activeIndex === index && 'bg-white shadow-md shadow-gray-200 text-primary',
            categoryActiveId === id && 'bg-white shadow-md shadow-gray-200 text-primary',
          )}
          key={index}>
          {/* <button>{category}</button> */}
          <button>{name}</button>
        </a>
      ))}
    </div>
  );
};
