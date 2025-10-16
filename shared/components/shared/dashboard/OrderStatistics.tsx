import { statusColors, statusText } from '@/shared/constants/dashboard';
import { OrderStatus, Product, ProductItem } from '@prisma/client';
import React from 'react';

type ProductItemWithDetails = ProductItem & {
  product: Pick<Product, 'name'>;
  _count: { cartItems: number };
};

type ProductItemWithSalesCount = ProductItemWithDetails & {
  salesCount: number;
};

interface Props {
  orderStats: {
    _count: number;
    status: OrderStatus;
  }[];
  totalOrders: number;
  popularProductsFinal: ProductItemWithSalesCount[];
}

export const OrderStatistics: React.FC<Props> = ({
  orderStats,
  totalOrders,
  popularProductsFinal,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Статистика заказов</h2>
      </div>
      <div className="p-6">
        
        {/* Orders visualization */}
        <div className="space-y-4">
          {orderStats.map((stat) => {
            const percentage = (stat._count / totalOrders) * 100;
            return (
              <div key={Math.random()*10000} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {statusText[stat.status]}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {stat._count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${statusColors[stat.status]}`}
                    style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Products */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные товары</h3>
          <div className="space-y-3">
            {popularProductsFinal.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{product.product.name}</span>
                </div>
                <span className="text-sm text-gray-600">{product.salesCount} продаж</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
