/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
      ACL: 'public-read',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
}

export function toPublicUrl(key: string): string {
  const base =
    process.env.CDN_BASE_URL?.replace(/\/+$/, '') ?? `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  // 안전한 경로 인코딩
  const safeKey = key.split('/').map(encodeURIComponent).join('/');
  return `${base}/${safeKey}`;
}
