import { prisma } from '@/prisma/prisma-client';
import { authOptions } from '@/shared/constants/authOptions';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
      return NextResponse.json({ message: 'Вы не авторизованы' }, { status: 401 });
    }

    const data = await prisma.user.findUnique({
      where: {
        id: Number(userSession.user.id),
      },
      select: {
        fullName: true,
        email: true,
        // password: false,
      },
    });

    if (!data) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '[USER_GET] Server error' }, { status: 500 });
  }
}
