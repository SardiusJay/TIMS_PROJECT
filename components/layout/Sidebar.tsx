'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Home,
  Map,
  BarChart3,
  TrendingUp,
  Award,
  FileText,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
    roles: ['admin', 'operations_manager', 'supervisor', 'engineer'],
  },
  {
    title: 'Sites Map',
    href: '/sites/map',
    icon: Map,
    roles: ['admin', 'operations_manager', 'supervisor'],
  },
  {
    title: 'Defect Analytics',
    href: '/analytics/defects',
    icon: BarChart3,
    roles: ['admin', 'operations_manager', 'supervisor'],
  },
  {
    title: 'Inspection Performance',
    href: '/analytics/inspections',
    icon: TrendingUp,
    roles: ['admin', 'operations_manager', 'supervisor'],
  },
  {
    title: 'Priority Scoring',
    href: '/priority-scoring',
    icon: Award,
    roles: ['admin', 'operations_manager', 'supervisor'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['admin', 'operations_manager', 'supervisor'],
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: Settings,
    roles: ['admin'],
    children: [
      { title: 'Users', href: '/admin/users', roles: ['admin'] },
      { title: 'Sites', href: '/admin/sites', roles: ['admin'] },
      { title: 'Templates', href: '/admin/templates', roles: ['admin'] },
      { title: 'System Health', href: '/admin/health', roles: ['admin'] },
      { title: 'Audit Log', href: '/admin/audit', roles: ['admin'] },
    ],
  },
];

interface NavItemProps {
  item: (typeof navItems)[0];
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
}

function NavItem({ item, pathname, isOpen, onClose }: NavItemProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-accent'
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
          />
        </button>
        {expanded && (
          <div className="pl-6 space-y-1">
            {item.children.map((child) => {
              const childActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm transition-colors',
                    childActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                  )}
                >
                  {child.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-accent'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.title}</span>
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  const filteredNavItems = navItems.filter((item) => hasRole(item.roles));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r bg-background transition-transform lg:static lg:top-0 lg:translate-x-0 lg:h-screen lg:border-r z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
            {filteredNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                pathname={pathname}
                isOpen={isOpen}
                onClose={onClose}
              />
            ))}
          </nav>
        </div>

        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </aside>
    </>
  );
}
