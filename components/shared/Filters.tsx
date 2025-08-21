'use client';

import React from 'react';
import { Title } from './Title';
import { FilterCheckbox } from './FilterChekbox';
import { Input } from '../ui';
import { RangeSlider } from './RandgeSlider';
import { CheckboxFiltersGroup } from './CheckboxFiltersGroup';
import { useIngredients } from '@/hooks/use-ingredients';

interface Props {
  className?: string;
}

interface PriceProps {
  priceFrom: number;
  priceTo: number;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const [prices, setPrices] = React.useState<PriceProps>({ priceFrom: 0, priceTo: 1000 });

  const { ingredients, loading, onAddId, selectedIds } = useIngredients();
  const items = ingredients.map((item) => ({ value: String(item.id), text: item.name }));

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrices((prevPrices) => ({ ...prevPrices, [name]: value }));
  };

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* Верхние чекбоксы */}
      <div className="flex flex-col gap-4">
        <FilterCheckbox text="Можно собирать" value="1" name="mojnoSobirat" />
        <FilterCheckbox text="Новинки" value="2" name="novinki" />
      </div>

      {/* Фильтр цен  */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            value={prices.priceFrom}
            onChange={(e) => updatePrice('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            min={100}
            max={1000}
            placeholder="1000"
            value={prices.priceTo}
            onChange={(e) => updatePrice('priceTo', Number(e.target.value))}
          />
        </div>
        <RangeSlider min={0} max={1000} step={10} value={[prices.priceFrom, prices.priceTo]} onValueChange={([priceFrom,priceTo])=>setPrices({priceFrom, priceTo})} />
      </div>

      {/* Фильтр ингредиентов */}
      <CheckboxFiltersGroup
        title="Ингредиенты"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={onAddId}
        selectedIds={selectedIds}
        name="ingredients"
      />
    </div>
  );
};
