import { prisma } from '@/prisma/prisma-client';
import { CartDTO } from '@/shared/services/dto/cart.dto';
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
