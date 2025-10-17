'use client';

import React from 'react';
import { cn } from '@/shared/lib';
import { Container } from './Container';
import Image from 'next/image';
import Link from 'next/link';
import { SearchInput } from './SearchInput';
import { CartButton } from './CartButton';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProfileButton } from './ProfileButton';
import { AuthModal } from './modals';

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className }) => {
  const router = useRouter();

  const [openAuthModal, setOpenAuthModal] = React.useState(false);

  const searchParams = useSearchParams();

  React.useEffect(() => {
    let toastMessage = '';

    if (searchParams.has('paid')) {
      toastMessage = 'Заказ успешно оплачен! Информация отправлена на почту.';
    }

    if (searchParams.has('verified')) {
      toastMessage = 'Почта успешно подтверждена!';
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace('/');
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);
    }
  }, []);

  return (
    <header className={cn('border-b', className)}>
      <div className="bg-red-500 text-white text-center py-2 px-4 text-sm font-bold">
        ДЕМО-РЕЖИМ | Это тестовая версия магазина
      </div>
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="PizzaLogo" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-black">NextPizza</h1>
              <p className="text-sm text-gray-400 leading-3">тебе понравится</p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
