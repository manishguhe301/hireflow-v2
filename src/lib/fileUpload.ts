import { supabaseServer } from './supabaseServer';

type UploadResult = {
  url: string;
  path: string;
};

export async function uploadFileToSupabase(
  file: File,
  bucket: 'company-logos' | 'company-documents',
): Promise<UploadResult> {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    const filePath = fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabaseServer.storage.from(bucket).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFileFromSupabase(
  filePath: string,
  bucket: 'company-logos' | 'company-documents',
): Promise<void> {
  try {
    const { error } = await supabaseServer.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

export async function getSignedUrl(
  filePath: string,
  bucket: 'company-logos' | 'company-documents',
  expiresInSeconds: number = 300,
): Promise<string> {
  try {
    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.error('Signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL error:', error);
    throw new Error('Failed to generate signed URL');
  }
}
