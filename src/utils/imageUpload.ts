import { supabase } from "@/integrations/supabase/client";

export const uploadMovieImage = async (file: File, type: 'poster' | 'hero'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${type}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('movie-images')
    .upload(filePath, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('movie-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteMovieImage = async (url: string): Promise<void> => {
  if (!url.includes('movie-images')) return; // Only delete our uploaded images
  
  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from('movie-images')
    .remove([fileName]);

  if (error) {
    console.error('Failed to delete image:', error);
  }
};