import { prisma } from '@/prisma/prisma-client';
import { JsonValue } from '@prisma/client/runtime/library';

const statusColors = {
  SUCCEEDED: 'bg-green-500',
  PENDING: 'bg-yellow-500',
  CANCELLED: 'bg-red-500',
};

const statusText = {
  SUCCEEDED: 'Успешно',
  PENDING: 'В обработке',
  CANCELLED: 'Отменен',
};

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

    // Считаем ВСЕ заказы для общей статистики
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: true,
    }),

    prisma.order.findMany({
      take: 10,
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Общий доход</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalRevenue.toLocaleString()} ₽
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">₽</span>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold">Всего заказов</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📦</span>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold">Пользователи</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">👥</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Последние заказы</h2>
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
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.fullName || 'Гость'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || order.email}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Статистика заказов</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orderStats.map((stat) => {
                  const percentage = (stat._count / totalOrders) * 100;
                  return (
                    <div key={stat.status} className="space-y-2">
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
