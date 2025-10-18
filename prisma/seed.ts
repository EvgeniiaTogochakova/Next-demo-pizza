// import { prisma} from './prisma-client';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { categories, ingredients, products } from './constants';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Прямое подключение
    },
  },
});

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: number;
  pizzaType?: 1 | 2;
  size?: 20 | 30 | 40;
}): Prisma.ProductItemUncheckedCreateInput => {
  return {
    productId,
    price: randomNumber(190, 600),
    pizzaType,
    size,
  };
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User Test',
        email: 'user@test.ru',
        password: hashSync('111111', 10),
        verified: new Date(),
        role: 'USER',
      },
      {
        fullName: 'Admin Admin',
        email: 'admin@test.ru',
        password: hashSync('111111', 10),
        verified: new Date(),
        role: 'ADMIN',
      },
      {
        fullName: 'Extra Admin',
        email: 'extra@test.ru',
        password: hashSync('171717', 10),
        verified: new Date(),
        role: 'ADMIN',
      },
    ],
  });

  await prisma.category.createMany({ data: categories });
  await prisma.ingredient.createMany({ data: ingredients });
  await prisma.product.createMany({ data: products });

  const pizza1 = await prisma.product.create({
    data: {
      name: 'Пепперони фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(0, 5),
      },
    },
  });

  const pizza2 = await prisma.product.create({
    data: {
      name: 'Сырная',
      imageUrl:
        'https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(5, 10),
      },
    },
  });

  const pizza3 = await prisma.product.create({
    data: {
      name: 'Чоризо фреш',
      imageUrl:
        'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(10, 40),
      },
    },
  });

  await prisma.productItem.createMany({
    data: [
      // Пицца "Пепперони фреш"
      generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

      // Пицца "Сырная"
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 40 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

      // Пицца "Чоризо фреш"
      generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
      generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),

      // Остальные продукты
      generateProductItem({ productId: 1 }),
      generateProductItem({ productId: 2 }),
      generateProductItem({ productId: 3 }),
      generateProductItem({ productId: 4 }),
      generateProductItem({ productId: 5 }),
      generateProductItem({ productId: 6 }),
      generateProductItem({ productId: 7 }),
      generateProductItem({ productId: 8 }),
      generateProductItem({ productId: 9 }),
      generateProductItem({ productId: 10 }),
      generateProductItem({ productId: 11 }),
      generateProductItem({ productId: 12 }),
      generateProductItem({ productId: 13 }),
      generateProductItem({ productId: 14 }),
      generateProductItem({ productId: 15 }),
      generateProductItem({ productId: 16 }),
      generateProductItem({ productId: 17 }),
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: '11111',
      },
      {
        userId: 2,
        totalAmount: 0,
        token: '222222',
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productItemId: 1,
      cartId: 1,
      quantity: 2,
      ingredients: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });

  await prisma.story.createMany({
    data: [
      {
        previewImageUrl:
          'https://avatars.mds.yandex.net/i?id=18d96622cead88d1fb770d4d6e0c1c8eeb37b83a-5582331-images-thumbs&n=13',
      },
      {
        previewImageUrl:
          'https://avatars.mds.yandex.net/i?id=ea2250b26761daccb3b652570b64630261c5454b-10898088-images-thumbs&n=13',
      },
      {
        previewImageUrl:
          'https://avatars.mds.yandex.net/i?id=99303f13ad680e7699ba7f148232533c-5286781-images-thumbs&n=13',
      },
      {
        previewImageUrl:
          'https://avatars.mds.yandex.net/i?id=e076e5cff5d50d61917255b20e2fe957_sr-10639406-images-thumbs&n=13',
      },
      {
        previewImageUrl:
          'https://avatars.mds.yandex.net/i?id=d33fef67f0b4009de2dc3465fa96a6dd_sr-2455092-images-thumbs&n=13',
      },
      {
        previewImageUrl:
          'https://avatars.mds.yandex.net/i?id=1924b26097925ea59abe8c0a318ea218_sr-9657256-images-thumbs&n=13',
      },
    ],
  });

  await prisma.storyItem.createMany({
    data: [
      {
        storyId: 1,
        sourceUrl:
          'https://avatars.mds.yandex.net/i?id=e4699e4cdb50a3902d9944f0e4fed252ba04b16b-4010175-images-thumbs&ref=rim&n=33&w=218&h=200',
      },
      {
        storyId: 1,
        sourceUrl:
          'https://avatars.mds.yandex.net/i?id=e6d16f6b41db938fb7547dee599f7746a8a86a9f-10590187-images-thumbs&ref=rim&n=33&w=160&h=200',
      },
      {
        storyId: 1,
        sourceUrl:
          'https://avatars.mds.yandex.net/i?id=0f26fba10ff8d610001ac3a070d469fa0665f4d1-8497298-images-thumbs&ref=rim&n=33&w=267&h=200',
      },
      {
        storyId: 1,
        sourceUrl: 'https://i.pinimg.com/236x/6f/34/26/6f3426613b7c01d3a5558a8ad66c7f8a.jpg?nii=t',
      },
      {
        storyId: 1,
        sourceUrl:
          'https://avatars.mds.yandex.net/i?id=749ff11f3fc063acb121d9b5ef616825-5238957-images-thumbs&ref=rim&n=33&w=200&h=200',
      },
    ],
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
