/**
 * Client-side authentication utilities
 */
'use client';

import { supabase } from './supabase/client';
import type { User } from '@/types';

export async function getClientSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getClientUser(): Promise<(User & { email: string }) | null> {
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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
}

