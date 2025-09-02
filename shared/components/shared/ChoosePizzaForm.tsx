'use client';

import React from 'react';
import { Ingredient, ProductItem } from '@prisma/client';

import {
  calcOnePizzaPrice,
  calcTotalIngredientPrice,
  calcTotalPizzaPrice,
  cn,
  getRankedPizzaSizes,
} from '@/shared/lib';
import { ProductImage } from './ProductImage';
import { Title } from './Title';
import { Button } from '../ui';

import {
  pizzaSizes,
  pizzaTypes,
  PizzaSize,
  PizzaType,
  mapPizzaType,
} from '@/shared/constants/pizza';
import { GroupVariants, Variant } from './GroupVariants';
import { IngredientItem } from './IngredientItem';
import { usePizzaOptions } from '@/shared/hooks';

interface Props {
  imageUrl: string;
  name: string;
  ingredients: Ingredient[];
  items: ProductItem[];
  onClickAddCart?: VoidFunction;
  className?: string;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  imageUrl,
  name,
  ingredients,
  items,
  onClickAddCart,
  className,
}) => {
  // const [size, setSize] = React.useState<PizzaSize>(20);
  // const [type, setType] = React.useState<PizzaType>(1);
  // const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const { size, type, selectedIngredients, setSize, setType, addIngredient, rankedPizzaSizes } =
    usePizzaOptions(items);
  const pizzaPrice = calcOnePizzaPrice(type, size, items);

  const totalIngredientsPrice = calcTotalIngredientPrice(ingredients, selectedIngredients);

  const totalPrice = calcTotalPizzaPrice(pizzaPrice, totalIngredientsPrice);

  const isDisabled: boolean = totalPrice === totalIngredientsPrice;

  const buttonText = isDisabled
    ? 'Нет пиццы в таком сочетании'
    : `Добавить в корзину за ${totalPrice} ₽`;

  const textDetails = `${size} см, ${mapPizzaType[type]} пицца`;

  const handleClickAdd = () => {
    onClickAddCart?.();
    console.log({ size, type, ingredients: selectedIngredients });
  };

  // const rankedPizzaSizes = getRankedPizzaSizes(type, items);

  // React.useEffect(() => {
  //   const firstAvailableVariant = rankedPizzaSizes.find((item) => !item.disabled);
  //   if (!firstAvailableVariant) return;
  //   setSize(Number(firstAvailableVariant.value) as PizzaSize);
  // }, [type]);

  return (
    <div className={cn(className, 'flex flex-1')}>
      <ProductImage imageUrl={imageUrl} size={size} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <p className="text-gray-400">{textDetails}</p>

        <div className="flex flex-col gap-4 mt-5">
          <GroupVariants
            // items={availablePizzaSizes}
            items={rankedPizzaSizes}
            value={String(size)}
            onClick={(value) => setSize(Number(value) as PizzaSize)}
          />
          <GroupVariants
            items={pizzaTypes}
            value={String(type)}
            onClick={(value) => setType(Number(value) as PizzaType)}
          />
        </div>

        <div className="bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar mt-5">
          <div className="grid grid-cols-3 gap-3">
            {ingredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                name={ingredient.name}
                price={ingredient.price}
                imageUrl={ingredient.imageUrl}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
              />
            ))}
          </div>
        </div>

        <Button
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
          disabled={isDisabled}
          onClick={handleClickAdd}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
