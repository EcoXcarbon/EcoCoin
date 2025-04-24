// firebaseadmin.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

try {
  // Validate environment variable existence
  if (!process.env.FIREBASE_ADMIN_KEY) {
    throw new Error('❌ Missing FIREBASE_ADMIN_KEY in environment variables');
  }

  // Safely parse service account
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  } catch (parseError) {
    throw new Error('❌ Malformed Firebase Admin Key - Invalid JSON format');
  }

  // Validate required service account fields
  if (!serviceAccount.project_id || !serviceAccount.private_key) {
    throw new Error('❌ Invalid Firebase Admin Key - Missing essential fields');
  }

  // Initialize singleton instance
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
  }

  db = getFirestore();
  
  // Verify database connection
  await db.listCollections(); // Test connection

} catch (error) {
  console.error('🔥 Critical Firebase Initialization Failure:', {
    message: error.message,
    stack: error.stack,
    envKeyExists: !!process.env.FIREBASE_ADMIN_KEY
  });
  
  // Prevent application from starting with broken Firebase connection
  process.exit(1);
}

export { db };