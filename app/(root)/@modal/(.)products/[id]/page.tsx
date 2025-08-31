import { ChooseProductModal } from '@/components/shared/modals/ChooseProductModal';
import { ProductWithRelations } from '@/@types/prisma-types';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({
  params: { id },
}: {
  params: { id: string };
}): Promise<JSX.Element | null> {
  const product: ProductWithRelations | null = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      ingredients: true,
      items: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return <ChooseProductModal product={product} />;
}
