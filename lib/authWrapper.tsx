'use client';

import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { apiClient } from '@/lib/api/client'; // atau fetchUser

type UserRole = 'admin' | 'nurse' | 'cashier' | 'doctor';

interface AuthWrapperProps {
    allowedRoles: UserRole[];
    children: ReactNode;
}

export function AuthWrapper({ allowedRoles, children }: AuthWrapperProps) {
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['me'],
        queryFn: () => apiClient.me(), // gunakan API client
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner variant="ellipsis" />
                <p className="text-gray-600 mt-2">Memverifikasi akses...</p>
            </div>
        );
    }

    if (isError || !data) {
        router.replace('/auth/login');
        return null;
    }

    if (!allowedRoles.includes(data.role)) {
        const dashboardMap: Record<UserRole, string> = {
            admin: '/dashboard/admin',
            nurse: '/dashboard/nurse',
            cashier: '/dashboard/cashier',
            doctor: '/dashboard/doctor',
        };
        if (data.role in dashboardMap) {
            router.replace(dashboardMap[data.role as UserRole]);
        } else {
            router.replace('/auth/login'); // fallback
        }

        return null;
    }

    return <>{children}</>;
}