import React from 'react';
import { StatElement } from './StatElement';

interface Props {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
}

export const StatsGrid: React.FC<Props> = ({ totalRevenue, totalOrders, totalUsers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Revenue Card */}
      <StatElement
        key={totalRevenue}
        heading="Общий доход"
        value={totalRevenue}
        icon="₽"
        colorClasses={{ border: 'border-blue-100', text: 'text-blue-600', bg: 'bg-blue-500' }}
      />

      {/* Orders Card */}
      <StatElement
        key={totalOrders}
        heading="Всего заказов"
        value={totalOrders}
        icon={<span>📦</span>}
        colorClasses={{ border: 'border-green-100', text: 'text-green-600', bg: 'bg-green-500' }}
      />

      {/* Users Card */}
      <StatElement
        key={totalUsers}
        heading="Пользователи"
        value={totalUsers}
        icon={<span>👥</span>}
        colorClasses={{ border: 'border-purple-100', text: 'text-purple-600', bg: 'bg-purple-500' }}
      />
    </div>
  );
};
