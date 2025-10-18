'use server';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/getUserSession';
// import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

interface UpdateUserData {
  fullName?: string;
  email?: string;
  password?: string;
}

// export async function updateUserInfo(body: Prisma.UserUpdateInput) {
export async function updateUserInfo(body: UpdateUserData) {
  try {
    const currentUser = await getUserSession();
    console.log(currentUser);

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    // Валидация email (если меняется)
    if (body.email && body.email !== currentUser.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: body.email,
          NOT: { id: Number(currentUser.id) }, // кроме текущего пользователя
        },
      });

      if (existingUser) {
        throw new Error('Email уже используется');
      }
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
      },
    });

    revalidatePath('/profile');
  } catch (err) {
    console.log('Error [UPDATE_USER]', err);
    throw err;
  }
}
