import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase/client';
import { UserProfile } from '../types';

// ============================================================================
// 🗄️ CRUD OPERATIONS
// ============================================================================

export const getAll = async (table: string): Promise<any[]> => {
  if (!supabase) {
    console.error('[Database] ❌ Supabase client is not initialized');
    throw new Error('Supabase client is not initialized');
  }
  
  let orderCol = 'created_at';
  if (table === 'bureau') orderCol = 'order';
  if (table === 'events' || table === 'reports') orderCol = 'date';
  
  console.log(`[Database] 📡 Fetching all from ${table} ordered by ${orderCol}`);
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderCol, { ascending: table === 'bureau' });
  
  if (error) {
    console.error(`[Database] ❌ Error fetching ${table}:`, error);
    throw error;
  }
  
  console.log(`[Database] ✅ Fetched ${data?.length || 0} items from ${table}`);
  return data || [];
};

export const insertItem = async (table: string, payload: Record<string, any>): Promise<any> => {
  if (!supabase) {
    console.error('[Database] ❌ Supabase client is not initialized');
    throw new Error('Supabase client is not initialized');
  }
  
  console.log(`[Database] ➕ Inserting into ${table}:`, payload);
  const { data, error } = await supabase
    .from(table)
    .insert([payload])
    .select();
  
  if (error) {
    console.error(`[Database] ❌ Error inserting into ${table}:`, error);
    throw error;
  }
  
  console.log(`[Database] ✅ Successfully inserted into ${table}`);
  return data;
};

export const updateItem = async (table: string, id: string, payload: Record<string, any>): Promise<any> => {
  if (!supabase) {
    console.error('[Database] ❌ Supabase client is not initialized');
    throw new Error('Supabase client is not initialized');
  }
  
  console.log(`[Database] ✏️ Updating ${table} with id ${id}:`, payload);
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`[Database] ❌ Error updating ${table}:`, error);
    throw error;
  }
  
  console.log(`[Database] ✅ Successfully updated ${table}`);
  return data;
};

export const deleteItem = async (table: string, id: string): Promise<void> => {
  if (!supabase) {
    console.error('[Database] ❌ Supabase client is not initialized');
    throw new Error('Supabase client is not initialized');
  }
  
  console.log(`[Database] 🗑️ Deleting from ${table} with id ${id}`);
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`[Database] ❌ Error deleting from ${table}:`, error);
    throw error;
  }
  
  console.log(`[Database] ✅ Successfully deleted from ${table}`);
};

// ============================================================================
// 📁 FILE UPLOAD
// ============================================================================

const generateFileName = (file: File): string => {
  const ext = file.name.split('.').pop();
  const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  return `${unique}.${ext}`;
};

export const uploadFile = async (file: File, bucket: string = 'amescao'): Promise<string> => {
  if (!supabase) {
    console.error('[Upload] ❌ Supabase client is not initialized');
    throw new Error('Supabase client is not initialized');
  }
  
  if (!file) {
    console.error('[Upload] ❌ No file provided');
    throw new Error('Aucun fichier fourni');
  }

  const fileName = generateFileName(file);
  console.log(`[Upload] 📤 Uploading file: ${fileName} to bucket: ${bucket}`);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('[Upload] ❌ Upload error:', error);
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  if (!data?.publicUrl) {
    console.error('[Upload] ❌ Could not get public URL');
    throw new Error('Impossible de récupérer l\'URL');
  }

  console.log(`[Upload] ✅ File uploaded successfully: ${data.publicUrl}`);
  return data.publicUrl;
};

// ============================================================================
// 👤 USER PROFILE
// ============================================================================

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) {
    console.warn('[Auth] ⚠️ Supabase client is not initialized');
    return null;
  }
  
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authData?.session?.user?.id) {
      console.warn('[Auth] ⚠️ No active session');
      return null;
    }

    const userId = authData.session.user.id;
    console.log(`[Auth] 🔍 Fetching profile for user: ${userId}`);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.warn('[Auth] ⚠️ Could not fetch profile:', error);
      return null;
    }

    const profile: UserProfile = {
      id: data.id,
      name: data.name || '',
      surname: data.surname || '',
      email: data.email || authData.session.user.email || '',
      photo: data.photo || undefined,
      role: data.role || 'member',
    };

    console.log(`[Auth] ✅ Profile loaded: ${profile.name} ${profile.surname} (${profile.role})`);
    return profile;
  } catch (error) {
    console.error('[Auth] ❌ Exception fetching user profile:', error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  if (!supabase) {
    console.error('[Auth] ❌ Supabase client is not initialized');
    throw new Error('Supabase client is not initialized');
  }
  
  console.log('[Auth] 🚪 Signing out user');
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('[Auth] ❌ Logout error:', error);
    throw error;
  }
  
  console.log('[Auth] ✅ User logged out successfully');
}
