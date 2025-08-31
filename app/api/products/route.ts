import { ProductWithRelations } from '@/@types/prisma-types';
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ProductWithRelations[]>> {
  const products = await prisma.product.findMany({
    include: {
      ingredients: true,
      items: true,
    },
  });

  return NextResponse.json(products);
}

// export const getProductWithRelations = async (): Promise<ProductWithRelations[]> => {
//   return await prisma.product.findMany({
//     include: {
//       ingredients: true,
//       items: true,
//     },
//   });
// };
