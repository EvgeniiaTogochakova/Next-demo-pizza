import { Prisma } from '@prisma/client';
import { axiosInstance } from './instance';

// Автоматически выводим тип из select
type UserProfileForCheckout = Prisma.UserGetPayload<{
  select: { fullName: true; email: true };
}>;

type ErrorResponse = {
  message: string;
};

export const getMe = async (): Promise<UserProfileForCheckout | null> => {
  try {
    const { data } = await axiosInstance.get<UserProfileForCheckout| ErrorResponse>('/auth/me');

    if ('message' in data) {
      console.log('Пользователь не авторизован:', data.message);
      return null; 
    }

    return data;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return null;
  }
};

