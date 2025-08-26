import admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage'; // ✅ Bucket 타입은 여기서 가져오기

let bucket: Bucket | null = null;

if (process.env.FIREBASE_CONFIG && process.env.FIREBASE_CONFIG.trim() !== '{}') {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

    // 줄바꿈 복원
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://codeit-beginner-project.firebasestorage.app',
      });
    }

    bucket = admin.storage().bucket();
    console.log('[firebase] initialized');
  } catch (error) {
    console.warn('[firebase] FIREBASE_CONFIG 파싱 실패, Firebase 비활성화:', error);
  }
} else {
  console.warn('[firebase] 비활성화됨: .env에 FIREBASE_CONFIG 없음');
}

export default bucket;
