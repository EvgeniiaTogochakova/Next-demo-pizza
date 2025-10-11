import { authOptions } from '@/shared/constants/authOptions';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'Next Pizza | Dashboard',
  description: 'Admin Dashboard',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userSession = await getServerSession(authOptions);
  console.log(userSession);

  if (!userSession||userSession?.user.role!=='ADMIN') {
    return <div>Данную страницу могу просматривать только администраторы!</div>;
  }

  return (
    <>
      {/* <header>DASHBOARD HEADER</header> */}
      {children}
    </>
  );
}
