import { User } from 'next-auth';
import { getServerSession} from 'next-auth';
import { authOptions } from '../constants/authOptions';

export const getUserSession = async (): Promise<User | null> => {
  const session = await getServerSession(authOptions);

  return session?.user ?? null;
};
  