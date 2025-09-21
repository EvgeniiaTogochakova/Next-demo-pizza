import { Ingredient, ProductItem } from '@prisma/client';
import { PizzaSize, PizzaType } from '@/shared/constants';


/**
 * Функия для вычисления суммы всех выбранных ингредиентов
 * 
 * @param ingredients - массив ингредиентов для конкретной пиццы
 * @param selectedIngredients - множество выбранных ингредиентов
 * @returns number общую стоимость выбранных ингредиентов
 */

export const calcTotalIngredientPrice = (
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
): number =>
  ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingr) => acc + ingr.price, 0);

/**
 * Функция для подсчета стоимости одной пиццы без учета ингредиентов
 * 
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбраннной пиццы
 * @param items - массив вариаций для конкретной пиццы
 * @returns number | undefined стоимость одной пиццы без ингредиентов
 */   
export const calcOnePizzaPrice = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[],
): number | undefined => items.find((item) => item.pizzaType === type && item.size === size)?.price;


/**
 * Функция для подсчета общей суммы к оплате
 * 
 * @param pizzaPrice - стоимость одной пиццы без учета ингредиентов
 * @param totalIngredientsPrice - стоимость выбранных ингредиентов
 * @returns number общая сумма пиццы и выбранных ингредиентов
 */

export const calcTotalPizzaPrice = (pizzaPrice: number|undefined, totalIngredientsPrice: number) =>
  (pizzaPrice || 0) + totalIngredientsPrice;


// универсальные функции=shared