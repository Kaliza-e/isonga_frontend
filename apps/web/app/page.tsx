import { redirect } from 'next/navigation';

/**
 * Isonga Connect Web Application Root
 * 
 * The web application is exclusively dedicated to the platform Super Admin.
 * All root traffic is directed to the Super Admin authentication experience.
 */
export default function RootPage() {
  redirect('/admin/login');
}
