import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect unauthenticated users to login
  // Authenticated users will be redirected to dashboard by ProtectedLayout
  redirect('/auth/login');
}
