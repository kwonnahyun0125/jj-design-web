/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.S3_BUCKET!;
const CDN = process.env.CLOUDFRONT_DOMAIN; // 배포 도메인(예: dxxxxx.cloudfront.net)

export const s3 = new S3Client({
  region: REGION,
  // EC2 IAM Role 사용 시 credentials 생략 가능
});

export async function uploadBufferToS3(key: string, buffer: Buffer, contentType: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // ❌ ACL 제거 (버킷이 ACL 불가 상태라서)
      // ACL: "public-read",
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
}

export function toPublicUrl(key: string) {
  // CloudFront 통해 제공 (버킷은 비공개 + OAC 권장)
  return CDN ? `https://${CDN}/${key}` : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
} // (임시 fallback)
