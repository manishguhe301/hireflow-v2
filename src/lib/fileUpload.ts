import { supabaseServer } from './supabaseServer';
import { b2Client, bucketName } from './b2';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as getAwsSignedUrl } from '@aws-sdk/s3-request-presigner';

type UploadResult = {
  url: string;
  path: string;
};

export async function uploadFileToSupabase(
  file: File,
  bucket:
    | 'company-logos'
    | 'company-documents'
    | 'user-resumes'
    | 'user-avatars',
): Promise<UploadResult> {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${bucket}/${timestamp}-${randomString}.${fileExt}`;

    const filePath = fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // const { data, error } = await supabaseServer.storage
    //   .from(bucket)
    //   .upload(filePath, buffer, {
    //     contentType: file.type,
    //     cacheControl: '3600',
    //     upsert: false,
    //   });

    // if (error) {
    //   console.error('Supabase upload error:', error);
    //   throw new Error(`Upload failed: ${error.message}`);
    // }

    // const {
    //   data: { publicUrl },
    // } = supabaseServer.storage.from(bucket).getPublicUrl(data.path);

    await b2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        CacheControl:
          bucket === 'user-avatars' || bucket === 'company-logos'
            ? 'public, max-age=31536000'
            : 'no-cache',
      }),
    );

    const publicUrl = `https://f004.backblazeb2.com/file/${bucketName}/${fileName}`;

    return {
      url: fileName,
      path: fileName,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFileFromSupabase(
  filePath: string,
  bucket:
    | 'company-logos'
    | 'company-documents'
    | 'user-resumes'
    | 'user-avatars',
): Promise<void> {
  try {
    // const { error } = await supabaseServer.storage
    //   .from(bucket)
    //   .remove([filePath]);

    // if (error) {
    //   console.error('Supabase delete error:', error);
    //   throw new Error(`Delete failed: ${error.message}`);
    // }

    console.log('deleting file ');

    const deleteres = await b2Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      }),
    );
    console.log('deleteres', deleteres);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

export async function getSignedUrl(
  filePath: string,
  // bucket?:
  //   | 'company-logos'
  //   | 'company-documents'
  //   | 'user-resumes'
  //   | 'user-avatars',
  expiresInSeconds: number = 300,
): Promise<string> {
  try {
    // const { data, error } = await supabaseServer.storage
    //   .from(bucket)
    //   .createSignedUrl(filePath, expiresInSeconds);

    // if (error) {
    //   console.error('Signed URL error:', error);
    //   throw new Error('Failed to generate signed URL');
    // }

    // return data.signedUrl;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    });

    const signedUrl = await getAwsSignedUrl(b2Client, command, {
      expiresIn: expiresInSeconds,
    });

    return signedUrl;
  } catch (error) {
    console.error('Signed URL error:', error);
    throw new Error('Failed to generate signed URL');
  }
}
