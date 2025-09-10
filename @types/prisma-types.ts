import { Category, Ingredient, Prisma, Product, ProductItem } from '@prisma/client';

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


const cartInclude = Prisma.validator<Prisma.CartInclude>()({
  items: {
    include: {
      productItem: {
        include: {
          product: true,
        },
      },
      ingredients: true,
    },
  },
});

export type CartWithDetails = Prisma.CartGetPayload<{
  include: typeof cartInclude;
}>;


// export type ProductWithRelations = Product & {
//   items: ProductItem[];
//   ingredients: Ingredient[];
// };

// export type CategoryWithRelations = Category & {
//   products: Product[];
// };
