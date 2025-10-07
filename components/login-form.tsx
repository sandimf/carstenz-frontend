'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from '@/lib/api/authService';
import { useRouter } from 'next/navigation';

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await authService.login(email, password);

      // Simpan role di cookie supaya middleware bisa baca
      document.cookie = `user_role=${user.role}; path=/;`;

      // Redirect sesuai role
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'nurse':
          router.push('/dashboard/nurse');
          break;
        case 'cashier':
          router.push('/dashboard/cashier');
          break;
        case 'doctor':
          router.push('/dashboard/doctor');
          break;
        default:
          router.push('/dashboard/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Email atau password salah';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle>Masuk ke akun Anda</CardTitle>
          <CardDescription>
            Masukkan email Anda di bawah untuk masuk ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@klinikgunung.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder='********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Authentication...' : 'Masuk'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
