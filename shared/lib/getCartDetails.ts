import { CartDTO } from '@/shared/services/dto/cart.dto';
import { calcCartItemTotalPrice } from '@/shared/lib/calcCartItemTotalPrice';

export type CartStateItem = {
  id: number;
  quantity: number;
  name: string;
  imageUrl: string;
  price: number;
  disabled?: boolean;
  pizzaSize?: number | null;
  pizzaType?: number | null;
  ingredients: Array<{ name: string; price: number }>;
};

interface ReturnProps {
  items: CartStateItem[];
  totalAmount: number;
}

// type CartItemDTO = {
//   id: number;
//   cartId: number;
//   productItemId: number;
//   quantity: number;
//   createdAt: Date;
//   updatedAt: Date;
// } & {
//   productItem: {
//     id: number;
//     price: number;
//     size: number | null;
//     pizzaType: number | null;
//     productId: number;
//   } & {
//     product: {
//       name: string;
//       id: number;
//       createdAt: Date;
//       updatedAt: Date;
//       imageUrl: string;
//       categoryId: number;
//     };
//   };
//   ingredients: {
//     name: string;
//     id: number;
//     createdAt: Date;
//     updatedAt: Date;
//     price: number;
//     imageUrl: string;
//   }[];
// };

export const getCartDetails = (data: CartDTO): ReturnProps => {
  const items = data.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.productItem.product.name,
    imageUrl: item.productItem.product.imageUrl,
    price: calcCartItemTotalPrice(item),
    disabled: false,
    pizzaSize: item.productItem.size,
    pizzaType: item.productItem.pizzaType,
    ingredients: item.ingredients.map((ingredient) => ({
      name: ingredient.name,
      price: ingredient.price,
    })),
  }));

  const totalAmount = items.reduce((acc, item) => item.price + acc, 0);

  return {
    items,
    // totalAmount: data.totalAmount,
    totalAmount,
  };
};


// это типичный преобразователь (DTO -> View Model)
// но, в принципе, функции неважно, откуда пришли данные, она просто делает новые типы
// поэтому можно счесть ее универсальной (shared)