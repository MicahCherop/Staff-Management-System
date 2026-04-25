import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// Initialize Firestore with the specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Diagnostic Error:', JSON.stringify(errInfo, null, 2));
  return errInfo;
}

// Test connection on boot to catch configuration issues early
const testConnection = async () => {
  try {
    // We attempt to get a non-existent doc just to check the channel connectivity
    await getDocFromServer(doc(db, '_internal_', 'connectivity_check'));
    console.log("Firebase connectivity check: Channel established.");
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, '_internal_/connectivity_check');
  }
};
testConnection();
