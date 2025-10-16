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

    //orderStatus
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

  // Самые популярные продукты (по успешным заказам)
  const popularProducts = await prisma.order.findMany({
    where: {
      status: 'SUCCEEDED',
    },
    select: {
      items: true,
    },
  });

  // Анализируем JSON поле items чтобы посчитать популярность
  const productSales: Record<number, number> = {};

  popularProducts.forEach((order) => {
    try {
      const items = JSON.parse(order.items as string) as OrderItem[];
      items.forEach((item) => {
        const productItemId = item.productItemId;
        productSales[productItemId] = (productSales[productItemId] || 0) + item.quantity;
      });
    } catch (error) {
      console.error('Error parsing order items:', error);
    }
  });

  // Получаем информацию о товарах
  const popularProductIds = Object.entries(productSales)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([id]) => parseInt(id));

  const popularProductsWithDetails = await prisma.productItem.findMany({
    where: {
      id: { in: popularProductIds },
    },
    include: {
      product: { select: { name: true } },
      _count: {
        select: { cartItems: true },
      },
    },
  });

  // Добавляем реальное количество продаж из нашего анализа
  const popularProductsFinal = popularProductsWithDetails.map((product) => ({
    ...product,
    salesCount: productSales[product.id] || 0,
  }));

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
            popularProductsFinal={popularProductsFinal}
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
