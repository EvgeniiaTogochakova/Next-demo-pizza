import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { CategoryWithRelations } from '@/@types/prisma-types';

export const getAll = async (): Promise<CategoryWithRelations[]> => {
  return (await axiosInstance.get<CategoryWithRelations[]>(ApiRoutes.CATEGORIES)).data;
};
