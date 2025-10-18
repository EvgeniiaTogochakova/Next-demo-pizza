'use server';

import { prisma } from '@/prisma/prisma-client';
import { VerificationUserTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib/sendEmail';
import { hashSync } from 'bcryptjs';
import { v4 as uuid } from 'uuid';

interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
}

// export async function registerUser(body: Prisma.UserCreateInput) {
export async function registerUser(body: CreateUserData) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error('Почта не подтверждена');
      }

      throw new Error('Пользователь уже существует');
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code = uuid();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      createdUser.email,
      'Next Pizza / 📝 Подтверждение регистрации',
      VerificationUserTemplate({
        code,
      }),
    );
  } catch (err) {
    console.log('Error [CREATE_USER]', err);
    throw err;
  }
}
