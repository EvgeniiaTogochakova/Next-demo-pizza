import { prisma } from '@/prisma/prisma-client';
import { updateCartTotalAmount } from '@/shared/lib';
import { CartDTO } from '@/shared/services/dto/cart.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<CartDTO | { error: string } | { message: string }>> {
  try {
    const id = Number(params.id);
    const data = (await req.json()) as { quantity: number };
    const token = req.cookies.get('cartToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Cart token not found' });
    }
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity: data.quantity,
      },
    });

    const updatedUserCart = await updateCartTotalAmount(token);

    if (!updatedUserCart) {
      return NextResponse.json(
        { error: 'Cart not found after cart item updating' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log('[CART_PATCH] Server Error', error);
    return NextResponse.json({ message: 'Не удалось обновить элемент корзины' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<CartDTO | { error: string } | { message: string }>> {
  try {
    const id = Number(params.id);
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Cart token not found' });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(params.id),
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    const updatedUserCart = await updateCartTotalAmount(token);

    if (!updatedUserCart) {
      return NextResponse.json(
        { error: 'Cart not found after cart item deletion' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log('[CART_DELETE] Server error', error);
    return NextResponse.json({ message: 'Не удалось удалить элемент корзины' }, { status: 500 });
  }
}
