'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getClientUser, signOut } from '@/lib/auth-client';
import type { User } from '@/types';
import { Car, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<(User & { email: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getClientUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Error signing out');
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">CarRental</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cars" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Browse Cars
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                    Admin Panel
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">{user.full_name || user.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-4">
            <Link
              href="/cars"
              className="block text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Cars
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">{user.full_name || user.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

