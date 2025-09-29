import { PaymentData } from '@/@types/yookassa';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

export async function createPayment(details: Props):Promise<PaymentData> {
  const { data } = await axios.post<PaymentData>(
    'https://api.yookassa.ru/v3/payments',
    {
      amount: {
        value: details.amount.toString(),
        currency: 'RUB',
      },
      capture: true,
      description: details.description,
      metadata: {
        order_id: details.orderId,
      },
      confirmation: {
        type: 'redirect',
        return_url: process.env.YOOKASSA_CALLBACK_URL,
      },
    },
    {
      auth: {
        username: process.env.YOOKASSA_STORE_ID as string,
        password: process.env.YOOKASSA_API_KEY as string,
      },
      headers: {
        'Content-Type': 'application/json',
        // 'Idempotence-Key': Math.random().toString(36).substring(7),
        'Idempotence-Key': uuidv4(),
      },
    },
  );

  return data;
}
