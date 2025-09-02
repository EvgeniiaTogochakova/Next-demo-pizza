import { ProductItem } from '@prisma/client';
import { pizzaSizes, PizzaType } from '../constants/pizza';
import { Variant } from '../components/shared/GroupVariants';

export const getRankedPizzaSizes = (type: PizzaType, items: ProductItem[]): Variant[] => {
  const availableItemssWithThisType = items.filter((item) => item.pizzaType === type);

  return pizzaSizes.map((variant) => ({
    name: variant.name,
    value: variant.value,
    disabled: !availableItemssWithThisType.some((item) => item.size === Number(variant.value)),
  }));
};
