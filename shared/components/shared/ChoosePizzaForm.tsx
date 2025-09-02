'use client';

import React from 'react';
import { useSet } from 'react-use';
import { Ingredient, ProductItem } from '@prisma/client';

import { cn } from '@/shared/lib/utils';
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
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const pizzaPrice = items.find((item) => item.pizzaType === type && item.size === size)?.price;

  console.log('одна пицца стоит ', pizzaPrice);

  const totalIngredientsPrice = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingr) => acc + ingr.price, 0);

  console.log('одни выбранные ингредиенты стоят ', totalIngredientsPrice);

  const totalPrice = (pizzaPrice || 0) + totalIngredientsPrice;

  console.log('сумма к оплате ', totalPrice);

  const isDisabled: boolean = totalPrice === totalIngredientsPrice;

  const buttonText = isDisabled
    ? 'Нет пиццы в таком сочетании'
    : `Добавить в корзину за ${totalPrice} ₽`;

  const textDetails = `${size} см, ${mapPizzaType[type]} пицца`;

  const handleClickAdd = () => {
    onClickAddCart?.();
    console.log({ size, type, ingredients: selectedIngredients });
  };

  const availableItemssWithThisType = items.filter((item) => item.pizzaType === type);
  console.log(availableItemssWithThisType);

  const rankedPizzaSizes = pizzaSizes.map((variant) => ({
    name: variant.name,
    value: variant.value,
    disabled: !availableItemssWithThisType.some((item) => item.size === Number(variant.value)),
  }));
  console.log(rankedPizzaSizes);

  React.useEffect(() => {
    const firstAvailableVariant=rankedPizzaSizes.find(item=>!item.disabled);
    if (!firstAvailableVariant) return;
    setSize(Number(firstAvailableVariant.value) as PizzaSize);
  }, [type]);

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
