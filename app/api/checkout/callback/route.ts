import { PaymentCallbackData } from '@/@types/yookassa';
import { prisma } from '@/prisma/prisma-client';
import { OrderFailureTemplate, OrderSuccessTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib/sendEmail';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData;

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' });
    }

    const isSucceeded = body.object.status === 'succeeded';
    const isCanceled = body.object.status === 'canceled';

    let newStatus = null;

    if (isSucceeded) {
      newStatus = OrderStatus.SUCCEEDED;
    } else if (isCanceled) {
      newStatus = OrderStatus.CANCELLED;
    }

    if (newStatus) {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: newStatus,
        },
      });
    }

    const items = JSON.parse(order?.items as string) as CartItemDTO[];

    if (isSucceeded) {
      await sendEmail(
        order.email,
        'Next Pizza / Ваш заказ успешно оформлен 🎉',
        OrderSuccessTemplate({ orderId: order.id, items }),
      );
    } 

    if (isCanceled) {
      await sendEmail(
        order.email,
        `Next Pizza / Возникла ошибка при оплате заказа 😟	`,
        OrderFailureTemplate({ orderId: order.id, items }),
      );
    }
  
  } catch (error) {
    console.log('[Checkout Callback] Error:', error);
    return NextResponse.json({ error: 'Server error' });
  }
}
