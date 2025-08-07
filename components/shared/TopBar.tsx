import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { Categories } from './Categories';
import { SortPopup } from './SortPopup';

interface Props {
  className?: string;
}

export const TopBar: React.FC<Props> = ({ className }) => (
  <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10', className)}>
    <Container className='flex items-center justify-between border'>
      <Categories />
      <SortPopup />
    </Container>
  </div>
);