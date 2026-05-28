'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    
    setIsLoading(true);
    clearError();

    try {
      await login({ email, password });
      // The redirect will happen automatically via useEffect when isAuthenticated changes
    } catch (err: any) {
      // Error is handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">TIMS Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-sm text-muted-foreground text-center space-y-2 border-t pt-4">
            <div>
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Demo Accounts:</p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@example.com');
                    setPassword('password123');
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Load Admin
                </button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
