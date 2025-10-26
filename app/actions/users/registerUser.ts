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
        return {
          error: true,
          type: 'ACCOUNT_IS_NOT_VERIFIED',
          message: 'Аккаунт не подтвержден',
        };
      }

      return {
        error: true,
        type: 'ACCOUNT_ALREADY_EXISTS',
        message: 'Аккаунт уже существует',
      };
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = uuid().slice(0, 4);

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      process.env.HELLO_RESEND_EMAIL!,
      createdUser.email,
      'Next Pizza / 📝 Подтверждение регистрации',
      VerificationUserTemplate({
        code,
      }),
    );

    return { success: true };
  } catch (err) {
    return {
      error: true,
      type: 'UNKNOWN_ERROR',
      message: 'Неизвестная ошибка',
    };
  }
}
