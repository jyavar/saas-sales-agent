import { supabaseService } from '../../services/supabase.js';
import { logger } from '../../utils/common/logger.js';
import { createClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface AuthResult {
  user: UserProfile;
  session?: Session;
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await supabaseService.query('users', {
      filters: { id: userId },
      limit: 1
    });
    if (!result.data || result.data.length === 0) return null;
    return result.data[0] as User;
  } catch (error: any) {
    logger.error('[DAL] getUserById failed', { error: error.message, userId });
    throw error;
  }
}

export async function listUsers(filters: Partial<User> = {}, limit = 50, offset = 0): Promise<User[]> {
  try {
    const result = await supabaseService.query('users', {
      filters,
      limit,
      offset
    });
    return result.data as User[];
  } catch (error: any) {
    logger.error('[DAL] listUsers failed', { error: error.message });
    throw error;
  }
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    const now = new Date().toISOString();
    const result = await supabaseService.insert('users', {
      ...user,
      created_at: now,
      updated_at: now
    }, null);
    return result.data as User;
  } catch (error: any) {
    logger.error('[DAL] createUser failed', { error: error.message, email: user.email });
    throw error;
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  try {
    const result = await supabaseService.update('users', userId, {
      ...updates,
      updated_at: new Date().toISOString()
    }, null);
    return result.data as User;
  } catch (error: any) {
    logger.error('[DAL] updateUser failed', { error: error.message, userId });
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await supabaseService.delete('users', userId, null);
    return true;
  } catch (error: any) {
    logger.error('[DAL] deleteUser failed', { error: error.message, userId });
    throw error;
  }
}

export async function createUserWithAuth(email: string, password: string, name: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabaseService.client.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    // Insert into users table
    const userProfile: UserProfile = {
      id: data.user.id,
      email,
      name,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await supabaseService.insert('users', userProfile, null);
    return { user: userProfile, session: data.session };
  } catch (error: any) {
    logger.error('[DAL] createUserWithAuth failed', { error: error.message, email });
    throw error;
  }
}

export async function signInUser(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabaseService.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Get user profile
    const { data: profile, error: profileError } = await supabaseService.adminClient
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileError) throw profileError;
    return { user: profile as UserProfile, session: data.session };
  } catch (error: any) {
    logger.error('[DAL] signInUser failed', { error: error.message, email });
    throw error;
  }
}

export async function signOutUser(): Promise<{ success: boolean }> {
  try {
    const { error } = await supabaseService.client.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    logger.error('[DAL] signOutUser failed', { error: error.message });
    throw error;
  }
}

export async function getUserByToken(token: string): Promise<UserProfile | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.sub;
    if (!userId) throw new Error('Invalid userId');
    return await getUserById(String(userId));
  } catch (error: any) {
    logger.error('[DAL] getUserByToken failed', { error: error.message });
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const result = await supabaseService.update('users', userId, {
      ...updates,
      updated_at: new Date().toISOString()
    }, null);
    return result.data as UserProfile;
  } catch (error: any) {
    logger.error('[DAL] updateUserProfile failed', { error: error.message, userId });
    throw error;
  }
} 