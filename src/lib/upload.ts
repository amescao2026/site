/**
 * File Upload Utility
 * Uploads files to Supabase Storage and returns the public URL
 */

import { supabase } from '../services/supabase/client';

/**
 * Generate a unique filename for uploaded files
 */
function generateFileName(file: File): string {
  const ext = file.name.split('.').pop();
  const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  return `${unique}.${ext}`;
}

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name (default: 'amescao')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, bucket: string = 'amescao'): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  if (!file) {
    throw new Error('No file provided');
  }

  console.log('[Upload] 📤 Starting file upload -', file.name);
  const fileName = generateFileName(file);

  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('[Upload] ❌ Upload failed', uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

  if (!data?.publicUrl) {
    console.error('[Upload] ❌ Could not retrieve public URL');
    throw new Error('Could not retrieve public URL');
  }

  console.log('[Upload] ✅ File uploaded successfully:', data.publicUrl);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param fileName The name of the file to delete
 * @param bucket The storage bucket name (default: 'amescao')
 */
export async function deleteFile(fileName: string, bucket: string = 'amescao'): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  console.log(`[Upload] 🗑️  Deleting file: ${fileName}`);

  const { error } = await supabase.storage.from(bucket).remove([fileName]);

  if (error) {
    console.error('[Upload] ❌ Delete failed', error);
    throw error;
  }

  console.log('[Upload] ✅ File deleted successfully');
}
