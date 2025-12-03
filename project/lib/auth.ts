/**
 * Authentication utilities and helpers
 * Server-side functions
 */
import { createServerSupabaseClient } from './supabase/server';
import type { User, UserRole } from '@/types';

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  const { data: userProfile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !userProfile) {
    return null;
  }

  return {
    ...session.user,
    ...userProfile,
  } as User & { email: string };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}

