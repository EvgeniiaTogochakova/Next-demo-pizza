import type { Metadata } from 'next';
import { Header } from '@/components/shared/Header';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next Pizza | Главная',
  description: 'Next Pizza Demo',
};

export default function HomeLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
      {modal}
    </main>
  );
}
