'use client';

import { useState } from 'react';
import { User } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminUsersPage() {
  const { hasRole } = useAuth();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock users data
  const mockUsers: User[] = [
    {
      id: 'user1',
      email: 'john@example.com',
      name: 'John Smith',
      phone: '+1234567890',
      role: 'operations_manager',
      assignedRegion: 'North',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastLogin: '2024-05-26T14:30:00Z',
    },
    {
      id: 'user2',
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      phone: '+0987654321',
      role: 'supervisor',
      assignedRegion: 'South',
      isActive: true,
      createdAt: '2024-02-20T09:00:00Z',
      lastLogin: '2024-05-26T11:15:00Z',
    },
    {
      id: 'user3',
      email: 'mike@example.com',
      name: 'Mike Davis',
      role: 'engineer',
      isActive: true,
      createdAt: '2024-03-10T08:00:00Z',
      lastLogin: '2024-05-25T16:45:00Z',
    },
    {
      id: 'user4',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      createdAt: '2023-12-01T12:00:00Z',
      lastLogin: '2024-05-26T15:00:00Z',
    },
  ];

  // Filter users
  const filteredUsers = mockUsers
    .filter((user) => roleFilter === 'all' || user.role === roleFilter)
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">Access Denied: Admin only</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage system users and their roles
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockUsers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {mockUsers.filter((u) => u.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockUsers.filter((u) => u.role === 'admin').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Engineers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockUsers.filter((u) => u.role === 'engineer').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium mb-2 block">Search Users</label>
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Filter by Role</label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="operations_manager">Operations Manager</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="engineer">Engineer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users match your filters
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            user.isActive
                              ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                              : 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">
                              <Trash2 className="h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
