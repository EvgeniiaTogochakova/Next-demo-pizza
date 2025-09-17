import { prisma } from '@/prisma/prisma-client';
import { checkArraysEqual } from '@/shared/lib';
import { findOrCreateCart } from '@/shared/lib/findOrCreateCart';
import { updateCartTotalAmount } from '@/shared/lib/updateCartTotalAmount';
import { CartDTO, CreateCartItemValues } from '@/shared/services/dto/cart.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
): Promise<NextResponse<CartDTO | { error: string } | { message: string }>> {
  try {
    // const userId = 1;
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          // {
          //   userId,
          // },
          {
            token,
          },
        ],
      },
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json(userCart);
  } catch (error) {
    // console.log(error);
    console.log('[CART_GET] Server error', error);
    return NextResponse.json({ message: 'Не удалось получить корзину' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get('cartToken')?.value;

    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;

    // Находим ВСЕ CartItem с подходящим productItemId
    const matchingCartItems = await prisma.cartItem.findMany({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
      },
      include: {
        ingredients: true,
      },
    });

    let exactMatch;
    // Ищем точное совпадение по ингредиентам
    if (data.ingredients) {
      exactMatch = matchingCartItems.find((item) =>
        checkArraysEqual(item.ingredients.map((ing) => ing.id).sort(), data.ingredients!.sort()),
      );
    } else {
      exactMatch = matchingCartItems[0];
    }

    // Если товар был найден, делаем +1
    if (exactMatch) {
      await prisma.cartItem.update({
        where: {
          id: exactMatch.id,
        },
        data: {
          quantity: exactMatch.quantity + 1,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: data.productItemId,
          quantity: 1,
          ingredients: { connect: data.ingredients?.map((id) => ({ id })) },
        },
      });
    }

    const updatedUserCart = await updateCartTotalAmount(token);

    const resp = NextResponse.json(updatedUserCart);
    resp.cookies.set('cartToken', token);
    return resp;
  } catch (error) {
    console.log('[CART_POST] Server error', error);
    return NextResponse.json(
      { message: 'Не удалось создать корзину или ее элемент' },
      { status: 500 },
    );
  }
}
