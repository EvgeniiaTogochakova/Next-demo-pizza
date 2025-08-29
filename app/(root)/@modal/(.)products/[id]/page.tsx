// Простой клиентский компонент модалки
'use client';

import { useEffect, useState } from 'react';

export default function ProductModalPage({ params: { id } }: { params: { id: string } }) {
  console.log('ModalPage rendered, {id}');
  const [isOpen, setIsOpen] = useState(false);

  // Открываем модалку при монтировании компонента
  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Modal Page</h1>
        <p className="mb-4">Product ID: {id}</p>
        <p>Это тестовая модалка. Если она показывается - значит структура работает!</p>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Закрыть
        </button>
      </div>
    </div>
  );
}
