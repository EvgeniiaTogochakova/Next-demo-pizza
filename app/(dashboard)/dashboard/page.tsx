import { prisma } from '@/prisma/prisma-client';
import { JsonValue } from '@prisma/client/runtime/library';
import { OrderStatistics, RecentOrders, StatsGrid } from '@/shared/components/shared/dashboard';
import { statusColors, statusText } from '@/shared/constants/dashboard';

// Интерфейс для товаров в заказе
interface OrderItem {
  productItemId: number;
  quantity: number;
  product?: {
    name: string;
  };
  ingredients?: Array<{
    id: number;
    name: string;
  }>;
}

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
        createdAt: true,
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
    .slice(0, 5)
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

  // Функция для получения информации о товарах в заказе
  const getOrderItemsInfo = (itemsJson: JsonValue) => {
    if (typeof itemsJson === 'string') {
      try {
        const items = JSON.parse(itemsJson) as OrderItem[];
        // const getOrderItemsInfo = (items: OrderItem[]) => {
        // try {
        return items.map((item) => ({
          name: item.product?.name || `Товар #${item.productItemId}`,
          quantity: item.quantity,
          ingredients: item.ingredients?.map((ing) => ing.name).join(', ') || '',
        }));
      } catch (error) {
        return [{ name: 'Ошибка загрузки товаров', quantity: 0, ingredients: '' }];
      }
    }
  };

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

          <OrderStatistics orderStats={orderStats} popularProductsFinal={popularProductsFinal} totalOrders={totalOrders}/>

        </div>
          
        {/* Detailed Orders Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Детали заказов</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Заказ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Товары
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrders.map((order) => {
                  const orderItems = getOrderItemsInfo(order.items);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.fullName || order.fullName || 'Гость'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || order.email}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {order.phone} • {order.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">
                          {order.totalAmount} ₽
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Пользователи системы</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Заказы
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Роль
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                        {user._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          user.verified
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                        {user.verified ? '✅ Подтвержден' : '⏳ Ожидание'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
