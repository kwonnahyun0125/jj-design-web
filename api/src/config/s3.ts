/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION ?? 'ap-northeast-2';
export const BUCKET = process.env.S3_BUCKET as string;

if (!BUCKET) {
  throw new Error('S3_BUCKET 환경변수가 없습니다.');
}

/**
 * 자격 증명은 EC2 인스턴스 프로파일(IAM 역할)로 자동 주입됩니다.
 * 별도 accessKey/secretKey를 넣지 마세요.
 */
export const s3 = new S3Client({ region: REGION });

/** 버퍼 업로드 */
export async function uploadBufferToS3(key: string, buffer: Buffer, contentType?: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'private',
    })
  );
}

/** 서명된 GET URL 발급 */
export async function getSignedGetUrl(key: string, expiresInSeconds = 60 * 60 * 24 * 7) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
}
