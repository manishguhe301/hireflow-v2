import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRedirectIfLoggedIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) return;
    const role = session.user.role;
    const dest =
      role === 'PLATFORM_ADMIN'
        ? '/admin'
        : role === 'COMPANY_ADMIN'
          ? '/company'
          : '/jobs';
    router.replace(dest);
  }, [session, router]);
}
