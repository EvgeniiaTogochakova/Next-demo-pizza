import { OrderItem } from '@/@types/prisma-types';
import { JsonValue } from '@prisma/client/runtime/library';
import { mapPizzaType } from '../constants';

// Функция для получения информации о товарах в заказе
export const getOrderItemsInfo = (itemsJson: JsonValue) => {
  if (typeof itemsJson !== 'string') {
    return;
  }
  try {
    const items = JSON.parse(itemsJson) as OrderItem[];
    return items.map((item) => {
      let nameString = item.productItem.product.name;

      if (item.productItem.size && item.productItem.pizzaType) {
        nameString += ` ${item.productItem.size}см ${mapPizzaType[item.productItem.pizzaType as keyof typeof mapPizzaType]}`;
      }

      return {
        name: nameString,
        quantity: item.quantity,
        ingredients: item.ingredients?.map((ing) => ing.name).join(', ') || '',
      };
    });
  } catch (error) {
    return [{ name: 'Ошибка загрузки товаров', quantity: 0, ingredients: '' }];
  }
};
