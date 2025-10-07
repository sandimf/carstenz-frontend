'use client';

import { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

type UserRole = 'admin' | 'nurse' | 'cashier' | 'doctor';

interface WithAuthOptions {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

async function fetchUser() {
  const res = await fetch('/api/me', { credentials: 'include' });
  if (!res.ok) throw new Error('Gagal mengambil user');
  return res.json() as Promise<{ role: UserRole }>;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions
) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
      fetchUser()
        .then((data) => {
          if (!options.allowedRoles.includes(data.role)) {
            const dashboardMap: Record<UserRole, string> = {
              admin: '/dashboard/admin',
              nurse: '/dashboard/nurse',
              cashier: '/dashboard/cashier',
              doctor: '/dashboard/doctor',
            };
            router.replace(dashboardMap[data.role]);
          } else {
            setRole(data.role);
          }
        })
        .catch(() => {
          router.replace(options.redirectTo || '/auth/login');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Spinner variant="ellipsis" />
            <p className="text-gray-600 mt-2">Memverifikasi akses...</p>
          </div>
        </div>
      );
    }

    if (!role) return null;

    return <Component {...props} />;
  };
}