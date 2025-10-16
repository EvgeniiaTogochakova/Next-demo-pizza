import { OrderWithUser } from '@/@types/prisma-types';
import { statusText } from '@/shared/constants/dashboard';
import { cn } from '@/shared/lib';
import { getOrderItemsInfo } from '@/shared/lib/getOrderItemsInfo';
import React, { PropsWithChildren } from 'react';

interface PropsDetailedORders {
  allOrders: OrderWithUser[];
}

const TdWrap = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <td className={cn('px-6 py-4', className)}>{children}</td>
);

export const DetailedOrdersTable: React.FC<PropsDetailedORders> = ({ allOrders }) => {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Детали заказов</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Заказ', 'Клиент', 'Товары', 'Сумма', 'Статус', 'Дата'].map((thElement) => (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {thElement}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allOrders.map((order) => {
              const orderItems = getOrderItemsInfo(order.items);
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <TdWrap className="whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  </TdWrap>
                  <TdWrap>
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.fullName || 'Гость'}
                    </div>
                    <div className="text-sm text-gray-500">{order.user?.email || order.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {order.phone} • {order.address}
                    </div>
                    {order.comment && (
                      <div className="text-xs text-red-400 mt-1">{order.comment}</div>
                    )}
                  </TdWrap>
                  <TdWrap>
                    <div className="space-y-1 max-w-xs">
                      {orderItems!.map((item, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">×{item.quantity}</span>
                          {item.ingredients && (
                            <div className="text-xs text-gray-400">{item.ingredients}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TdWrap>
                  <TdWrap className="whitespace-nowrap">
                    <span className="text-sm font-bold text-green-600">{order.totalAmount} ₽</span>
                  </TdWrap>
                  <TdWrap className="whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'SUCCEEDED'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                      {statusText[order.status]}
                    </span>
                  </TdWrap>
                  <TdWrap className="whitespace-nowrap text-sm text-gray-500 flex flex-col">
                      <span>{new Date(order.createdAt).toLocaleString('ru-RU')}</span>
                      <span>{new Date(order.updatedAt).toLocaleTimeString('ru-RU')}</span>
                  </TdWrap>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
