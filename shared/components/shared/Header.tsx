import React from 'react';
import { cn } from '@/shared/lib';
import { Container } from './Container';
import Image from 'next/image';
import { Button } from '@/shared/components/ui';
import { User } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from './SearchInput';
import { CartButton } from './CartButton';

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => (
  <header className={cn('border', className)}>
    <Container className="flex items-center justify-between py-8 border">
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

      <div className="mx-10 flex-1">
        <SearchInput />
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="flex items-center gap-1">
          <User size={16} /> Войти
        </Button>

        <div>
          <CartButton />
        </div>
      </div>
    </Container>
  </header>
);
