'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedLayout>
  );
}
