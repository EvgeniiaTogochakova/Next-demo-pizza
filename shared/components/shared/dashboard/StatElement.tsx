import { cn } from '@/shared/lib';
import React from 'react';

interface Props {
  heading: string;
  value: number;
  icon: React.ReactNode;
  colorClasses: {
    border: string;
    text: string;
    bg: string;
  };
}
export const StatElement: React.FC<Props> = ({ heading, value, icon, colorClasses }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-lg border p-6 transform hover:scale-105 transition-transform duration-200)',
        colorClasses.border,
      )}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn('font-semibold', colorClasses.text)}>{heading}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</h3>
        </div>
        <div
          className={cn(
            'w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center',
            colorClasses.bg,
          )}>
          <span className="text-white font-bold text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
};
