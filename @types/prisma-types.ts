import { Category, Ingredient, Order, Prisma, Product, ProductItem, User } from '@prisma/client';

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

export type OrderWithUser = Order & {
  user: Pick<User, 'fullName' | 'email'> | null;
};

// Тип для товаров в заказе
export type OrderItem = {
  productItemId: number;
  quantity: number;
  comment?: string;
  ingredients?: Array<{
    id: number;
    name: string;
  }>;
} & {
  productItem: {
    product: {
      name: string;
    };
    size?: number;
    pizzaType?: number;
  };
};


// const cartInclude = Prisma.validator<Prisma.CartInclude>()({
//   items: {
//     include: {
//       productItem: {
//         include: {
//           product: true,
//         },
//       },
//       ingredients: true,
//     },
//   },
// });

// export type CartWithDetails = Prisma.CartGetPayload<{
//   include: typeof cartInclude;
// }>;

// export type ProductWithRelations = Product & {
//   items: ProductItem[];
//   ingredients: Ingredient[];
// };

// export type CategoryWithRelations = Category & {
//   products: Product[];
// };
