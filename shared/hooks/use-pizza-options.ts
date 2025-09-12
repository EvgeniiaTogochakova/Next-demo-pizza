'use client';

import React from 'react';
import { useSet } from 'react-use';
import { PizzaSize, PizzaType } from '../constants/pizza';
import { Variant } from '../components/shared/GroupVariants';
import { getRankedPizzaSizes } from '../lib';
import { ProductItem } from '@prisma/client';

interface ReturnProps {
  size: PizzaSize;
  type: PizzaType;
  selectedIngredients: Set<number>;
  currentItemId?:number;
  setSize: (size: PizzaSize) => void;
  setType: (type: PizzaType) => void;
  addIngredient: (id: number) => void;
  rankedPizzaSizes: Variant[];
}

export const usePizzaOptions = (items: ProductItem[]): ReturnProps => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const rankedPizzaSizes = getRankedPizzaSizes(type, items);

  const currentItemId=(items.find(item=>item.size===size&&item.pizzaType===type))?.id;

  React.useEffect(() => {
    const firstAvailableVariant = rankedPizzaSizes.find((item) => !item.disabled);
    if (!firstAvailableVariant) return;
    setSize(Number(firstAvailableVariant.value) as PizzaSize);
  }, [type]);

  return {
    size,
    type,
    selectedIngredients,
    currentItemId,
    setSize,
    setType,
    addIngredient,
    rankedPizzaSizes,
  };
};
