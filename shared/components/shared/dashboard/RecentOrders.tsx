import { OrderWithUser } from '@/@types/prisma-types';
import { statusText } from '@/shared/constants/dashboard';
import React, { PropsWithChildren } from 'react';

interface Props {
  recentOrders: OrderWithUser[];
}

const TdWrap: React.FC<PropsWithChildren> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap">{children}</td>
);

export const RecentOrders: React.FC<Props> = ({ recentOrders }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Последние заказы</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Заказ', 'Клиент', 'Сумма', 'Статус'].map((thElement) => (
                <th
                  key={thElement}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {thElement}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <TdWrap
                  children={<span className="text-sm font-medium text-gray-900">#{order.id}</span>}
                />
                <TdWrap
                  children={
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.fullName || 'Гость'}
                    </div>
                  }
                />
                <TdWrap
                  children={
                    <div className="text-sm text-gray-500">{order.user?.email || order.email}</div>
                  }
                />

                <TdWrap
                  children={
                    <span className="text-sm font-bold text-green-600">{order.totalAmount} ₽</span>
                  }
                />

                <TdWrap>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
