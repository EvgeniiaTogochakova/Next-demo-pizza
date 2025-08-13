import { User } from '@prisma/client';
import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest): Promise<NextResponse<User>> {
  const data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = await req.json();
  const user = await prisma.user.create({ data });
  return NextResponse.json(user);
}
