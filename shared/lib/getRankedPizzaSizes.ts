import { ProductItem } from '@prisma/client';
import { pizzaSizes, PizzaType } from '../constants/pizza';

export const getRankedPizzaSizes = (type:PizzaType, items:ProductItem[]) => {
    const availableItemssWithThisType = items.filter((item) => item.pizzaType === type);
    
      return pizzaSizes.map((variant) => ({
        name: variant.name,
        value: variant.value,
        disabled: !availableItemssWithThisType.some((item) => item.size === Number(variant.value)),
      }));   
}

