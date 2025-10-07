import { redirect } from 'next/navigation'; // 14.2k (gzipped: 3k)
import { getUserSession } from '@/shared/lib/getUserSession';
import { prisma } from '@/prisma/prisma-client';
import { ProfileForm } from '@/shared/components/shared/ProfileForm';

export default async function ProfilePage() {
  const userSession = await getUserSession();

  if (!userSession) {
    return redirect('/not-auth');
  }

  const user = await prisma.user.findFirst({ where: { id: Number(userSession?.id) } });

  if (!user) {
    return redirect('/not-auth');
  }

  return <ProfileForm data={user} />;
}
