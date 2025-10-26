'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TFormRegisterValues, formRegisterSchema } from './schemas';
import { FormInput } from '../../../form';
import { Button } from '@/shared/components/ui';
import { registerUser } from '@/app/actions/users/registerUser';

interface Props {
  onClose?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      const result = await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      if (result?.error) {
        if (result.type === 'ACCOUNT_IS_NOT_VERIFIED') {
          return toast.error(`${result.message}. Подтвердите почту`, {
            icon: '❌',
          });
        }
        if (result.type === 'ACCOUNT_ALREADY_EXISTS') {
          return toast.error(`${result.message}. Войдите через соцсети`, {
            icon: '❌',
          });
        }
      }

      toast.success('Вы почти зарегистрировались 📝. Подтвердите свою почту');
      onClose?.();
    } catch (error) {
      // для сетевых/неожиданных ошибок
      toast.error('Возникли ошибки при регистрации. Проверьте правильность E-Mail или пароля', {
        icon: '❌',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="fullName" label="Полное имя" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <FormInput name="confirmPassword" label="Подтвердите пароль" type="password" required />

        <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
          Зарегистрироваться
        </Button>
      </form>
    </FormProvider>
  );
};
