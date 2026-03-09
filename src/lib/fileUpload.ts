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

    const shouldGenerateSignedUrl =
      bucket === 'company-logos' || bucket === 'user-avatars';

    if (shouldGenerateSignedUrl) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      const signedUrl = await getAwsSignedUrl(b2Client, command, {
        expiresIn: 60 * 60 * 24 * 7,
      });

      return {
        url: signedUrl,
        path: fileName,
      };
    }

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
    const deleteres = await b2Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      }),
    );
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
