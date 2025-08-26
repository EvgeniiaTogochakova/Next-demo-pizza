import { Prisma } from '@prisma/client';

const productInclude = Prisma.validator<Prisma.ProductInclude>()({
  ingredients: true,
  items: true,
});

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;


const categoryInclude = Prisma.validator<Prisma.CategoryInclude>()({
  products: {
    include: {
      ingredients: true,
      items: true,
    },
  },
});


export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: typeof categoryInclude;
}>;






