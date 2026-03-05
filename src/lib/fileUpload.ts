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

export async function uploadFileToB2(
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // console.log('UPLOADING FILE+++++++++++++++++++');

    const res = await b2Client.send(
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

    // console.log(res);

    // console.log('UPLOADING COMPLETE+++++++++++++++++++');

    return {
      url: fileName,
      path: fileName,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFileFromB2(filePath: string): Promise<void> {
  try {
    // console.log('DELETING FILE+++++++++++++++++++ ');

    const deleteres = await b2Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      }),
    );

    // console.log(deleteres);

    // console.log('DELETING COMPLETE+++++++++++++++++++ ');
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

export async function getSignedUrl(
  filePath: string,
  expiresInSeconds: number = 300,
): Promise<string> {
  try {
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

type CacheItem = {
  url: string;
  expiresAt: number;
};

const cache = new Map<string, CacheItem>();

export async function getCachedSignedUrl(path: string, expires = 604800) {
  const cached = cache.get(path);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const url = await getSignedUrl(path, expires);

  cache.set(path, {
    url,
    expiresAt: Date.now() + expires * 1000 - 60_000,
  });

  return url;
}
