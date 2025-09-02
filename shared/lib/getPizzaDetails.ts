import { Ingredient, ProductItem } from '@prisma/client';
import { PizzaSize, PizzaType, mapPizzaType } from '../constants/pizza';
import { calcOnePizzaPrice, calcTotalIngredientPrice, calcTotalPizzaPrice } from './calcPrice';

export const getPizzaDetails = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
) => {
  const pizzaPrice = calcOnePizzaPrice(type, size, items);

  const totalIngredientsPrice = calcTotalIngredientPrice(ingredients, selectedIngredients);

  const totalPrice = calcTotalPizzaPrice(pizzaPrice, totalIngredientsPrice);

  const isDisabled: boolean = totalPrice === totalIngredientsPrice;

  const buttonText = isDisabled
    ? 'Нет пиццы в таком сочетании'
    : `Добавить в корзину за ${totalPrice} ₽`;

  const textDetails = `${size} см, ${mapPizzaType[type]} пицца`;
  return { isDisabled, buttonText, textDetails };
};
