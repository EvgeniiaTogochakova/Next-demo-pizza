import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

export const OrderFailureTemplate: React.FC<Props> = ({ orderId, items }) => (
  <div>
    <h1>Попытайтесь еще раз</h1>

    <p>Оплата за Ваш заказ #{orderId} не прошла. 😟<br/> Вот список товаров для следующей попытки заказа:</p>

    <hr />

    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.productItem.product.name} | {item.productItem.price} ₽ x {item.quantity} шт. ={' '}
          {item.productItem.price * item.quantity} ₽
        </li>
      ))}
    </ul>
  </div>
);
