import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/shared/components/shared/Header';

export const metadata: Metadata = {
  title: 'Next Pizza | Главная',
  description: 'Next Pizza Demo',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Suspense>
        <Header />
      </Suspense>
      {children}
      {modal}
    </main>
  );
}
