import { ProductItem } from '@prisma/client';

export const getMinPrice = (items: ProductItem[]) => {
  if (items.length === 0) return 0;
  return Math.min(...items.map((item) => item.price));
};
