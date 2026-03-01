import { S3Client } from '@aws-sdk/client-s3';

const keyId = process.env.B2_KEY_ID!;
const applicationKey = process.env.B2_APPLICATION_KEY!;
const bucketName = process.env.B2_BUCKET_NAME!;
const endpoint = process.env.B2_ENDPOINT!;

if (!keyId || !applicationKey || !bucketName || !endpoint) {
  throw new Error('Missing B2 credentials in environment variables');
}

export const b2Client = new S3Client({
  region: 'us-west-004',
  endpoint: `https://${endpoint}`,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: applicationKey,
  },
});

export { bucketName };
