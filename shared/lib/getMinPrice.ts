import { ProductItem } from '@prisma/client';

export const getMinPrice = (items: ProductItem[]) => {
  if (items.length === 0) return 0;
  return Math.min(...items.map((item) => item.price));
};

// типичная универсальная (shared) функция

// Еще более универсальный вариант
// export const getMinPrice = <T extends { price: number }>(items: T[]): number => {
//   if (items.length === 0) return 0;
//   return Math.min(...items.map((item) => item.price));
// };
