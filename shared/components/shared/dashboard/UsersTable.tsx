import { User } from '@prisma/client';
import React, { PropsWithChildren } from 'react';

type UserWithOrders = Pick<User, 'id' | 'fullName' | 'email' | 'role' | 'verified'> & {
  _count: { orders: number };
};

interface Props {
  users: UserWithOrders[];
}

const TdWrap: React.FC<PropsWithChildren> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap">{children}</td>
);

export const UsersTable: React.FC<Props> = ({ users }) => {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Пользователи системы</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Имя', 'Email', 'Заказы', 'Статус', 'Роль'].map((thElement) => (
                <th key={thElement} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {thElement}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <TdWrap
                  children={
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                  }
                />
                <TdWrap
                  children={<div className="text-sm font-medium text-gray-900">{user.email}</div>}
                />

                <TdWrap>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                    {user._count.orders}
                  </span>
                </TdWrap>

                <TdWrap>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      user.verified
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                    {user.verified ? '✅ Подтвержден' : '⏳ Ожидание'}
                  </span>
                </TdWrap>

                <TdWrap>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                    {user.role}
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
