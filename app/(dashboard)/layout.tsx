import { InfoBlock } from '@/shared/components';
import { authOptions } from '@/shared/constants/authOptions';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'Next Pizza | Dashboard',
  description: 'Admin Dashboard',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userSession = await getServerSession(authOptions);

  if (!userSession||userSession?.user.role!=='ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <InfoBlock
          title="Доступ ограничен"
          text="Данную страницу могут просматривать только администраторы системы"
          imageUrl="/assets/images/lock.png"
        />
      </div>
    );
  }

  return (
    <>
      {/* <header>DASHBOARD HEADER</header> */}
      {children}
    </>
  );
}
