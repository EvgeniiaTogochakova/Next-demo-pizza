import { OrderItem } from '@/@types/prisma-types';
import { prisma } from '@/prisma/prisma-client';
import {
  DetailedOrdersTable,
  OrderStatistics,
  RecentOrders,
  StatsGrid,
  UsersTable,
} from '@/shared/components/shared/dashboard';

export default async function DashboardPage() {
  const [users, orders, recentOrders, orderStats, allOrders, revenueData] = await Promise.all([
    // users
    prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        verified: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    // orders
    // Считаем ВСЕ заказы для общей статистики
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: true,
    }),

    // recentOrders
    prisma.order.findMany({
      take: 10,
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    //orderStats
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),

    //allOrders
    // Все заказы для детальной таблицы
    prisma.order.findMany({
      take: 20,
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    // revenueData
    // Доход только из успешных заказов
    prisma.order.aggregate({
      where: {
        status: 'SUCCEEDED', // Только оплаченные заказы
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  // Анализируем популярность продуктов, собираем статистику по 10 самым популярным

  const popularProducts = await prisma.productPopularity.findMany({
    include: {
      productItem: {
        select: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      purchaseCount: 'desc',
    },
    take: 10,
  });

  console.log(popularProducts);

  // Теперь используем revenueData для дохода
  const totalRevenue = revenueData._sum.totalAmount || 0;
  const totalOrders = orders._count;
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
          <p className="text-gray-600 mt-2">Обзор Next Pizza</p>
        </div>

        <StatsGrid totalRevenue={totalRevenue} totalOrders={totalOrders} totalUsers={totalUsers} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <RecentOrders recentOrders={recentOrders} />

          <OrderStatistics
            orderStats={orderStats}
            popularProducts={popularProducts}
            totalOrders={totalOrders}
          />
        </div>

        {/* Detailed Orders Table */}
        <DetailedOrdersTable allOrders={allOrders} />

        {/* Users Table */}
        <UsersTable users={users} />
      </div>
    </div>
  );
}
