import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_ADMIN_KEY
  ? JSON.parse(process.env.FIREBASE_ADMIN_KEY)
  : null;

if (!serviceAccount) {
  throw new Error('❌ Firebase Admin Key missing in environment variables');
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();
export { db };
