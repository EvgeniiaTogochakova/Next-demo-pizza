'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CheckoutSidebar,
  Container,
  FormInput,
  Title,
  WhiteBlock,
} from '@/shared/components/shared';
import { Input, Textarea } from '@/shared/components/ui';
import { useCart } from '@/shared/hooks';
import { checkoutFormSchema, CheckoutFormValues } from '@/shared/constants';
import { CheckoutCart, CheckoutPersonalForm } from '@/shared/components/shared/checkout';

export default function CheckoutPage() {
  const { items, totalAmount, loading, removeCartItem, updateItemQuantity } = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      comment: '',
    },
  });

  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Container className="mt-10">
      <Title text="Оформление заказа" className="font-extrabold mb-8 text-[36px]" />

      <FormProvider {...form}>
        <div className="flex gap-10">
          {/* Левая часть */}
          <div className="flex flex-col gap-10 flex-1 mb-20">
            <CheckoutCart
              items={items}
              loading={loading}
              onClickCountButton={onClickCountButton}
              removeCartItem={removeCartItem}
            />

            <CheckoutPersonalForm className={loading ? 'opacity-40 pointer-events-none' : ''} />

            <WhiteBlock title="3. Адрес доставки">
              <div className="flex flex-col gap-5">
                <Input name="firstName" className="text-base" placeholder="Введите адрес" />
                <Textarea className="text-base" rows={5} placeholder="Комментарий к заказу" />
              </div>
            </WhiteBlock>
          </div>

          {/* Правая часть */}
          <div className="w-[450px]">
            <CheckoutSidebar totalAmount={totalAmount} loading={loading} />
          </div>
        </div>
      </FormProvider>
    </Container>
  );
}
