import { CategoryWithRelations } from '@/lib/prisma-types';
import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CategoryWithRelations[]>> {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          ingredients: true,
          items: true,
        },
      },
    },
  });

  return NextResponse.json(categories);
}

// export const getCategoriesWithRelations = async (): Promise<CategoryWithRelations[]> => {
//   return await prisma.category.findMany({
//     include: {
//       products: {
//         include: {
//           ingredients: true,
//           items: true,
//         },
//       },
//     },
//   });
// };
