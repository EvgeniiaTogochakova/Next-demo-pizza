'use client';

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
  onChange?: (value?: string) => void;
}

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  const apiKey = process.env.NEXT_PUBLIC_DADATA_API_KEY;

  if (!apiKey) {
    console.error('DADATA API key is not defined');
    return <div>Ошибка конфигурации</div>;
  }

  return <AddressSuggestions token={apiKey} onChange={(data) => onChange?.(data?.value)} />;
};
