'use client';

import React from 'react';
import { useCategories } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store/category';
import { Skeleton } from '../ui';
import { CategoryWithRelations } from '@/@types/prisma-types';

interface Props {
  className?: string;
  categories: CategoryWithRelations[];
}

// const categories = ['Пиццы', 'Комбо', 'Закуски', 'Коктейли', 'Кофе', 'Напитки', 'Десерты', 'Еще'];

// const categories = [
//   { id: 1, name: 'Пиццы' },
//   { id: 2, name: 'Комбо' },
//   { id: 3, name: 'Закуски' },
//   { id: 4, name: 'Коктейли' },
//   { id: 5, name: 'Кофе' },
//   { id: 6, name: 'Напитки' },
//   { id: 7, name: 'Десерты' },
//   { id: 8, name: 'Еще' },
// ];

// const activeIndex = 0;

export const Categories: React.FC<Props> = ({ className, categories }) => {
  // export const Categories: React.FC<Props> = ({ className }) => {
  // const { categories, categoriesLoading } = useCategories();

  const categoryActiveId = useCategoryStore((state) => state.activeId);

  // if (categoriesLoading) {
  //   return (
  //     <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
  //       {...Array(5)
  //         .fill(0)
  //         .map((_, index) => <Skeleton key={index} className="w-28 h-11 mb-4 rounded-2xl px-5" />)}

  //     </div>
  //   );
  // }

  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {/* {categories.map((category, index) => ( */}
      {categories.map(({ id, name }, index) => (
        <a
          href={`/#${name}`}
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
