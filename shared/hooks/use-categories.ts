'use client';

import React from 'react';

import { Api } from '@/shared/services/api-client';
import { CategoryWithRelations } from '@/@types/prisma-types';

export const useCategories = () => {
  const [categories, setCategories] = React.useState<CategoryWithRelations[]>([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const categories = await Api.categories.getAll();
        setCategories(categories);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return {
    categories,
    categoriesLoading: loading,
  };
};
