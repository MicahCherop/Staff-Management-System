import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  deleteDoc,
  onSnapshot,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const userService = {
  async getUser(uid: string) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as any) } : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  },
  async getUsers(branch?: string, status: 'active' | 'exited' = 'active') {
    try {
      let q = query(collection(db, 'users'), where('status', '==', status));
      if (branch) {
        q = query(q, where('branch', '==', branch));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
    }
  },
  async createUser(data: any) {
    try {
      await setDoc(doc(db, 'users', data.uid), {
        ...data,
        joinedAt: new Date().toISOString(),
        status: 'active'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${data.uid}`);
    }
  }
};

export const attendanceService = {
  async getAttendance(date: string, branch?: string) {
    try {
      let q = query(collection(db, 'attendance'), where('date', '==', date));
      if (branch) {
        q = query(q, where('branch', '==', branch));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'attendance');
    }
  },
  async submitAttendance(data: any) {
    try {
      const id = `${data.userId}_${data.date}`;
      await setDoc(doc(db, 'attendance', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'attendance');
    }
  }
};

export const leaveService = {
  async getLeaves(branch?: string) {
    try {
      let q = collection(db, 'leaves') as any;
      if (branch) {
        q = query(q, where('branch', '==', branch));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'leaves');
    }
  },
  async createLeaveRequest(data: any) {
    try {
      await addDoc(collection(db, 'leaves'), {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'leaves');
    }
  },
  async updateLeaveStatus(leaveId: string, status: string, adminId: string) {
    try {
      await updateDoc(doc(db, 'leaves', leaveId), {
        status,
        approvedBy: adminId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leaves/${leaveId}`);
    }
  }
};

export const vacancyService = {
  async getVacancies(branch?: string) {
    try {
      let q = collection(db, 'vacancies') as any;
      if (branch) {
        q = query(q, where('branch', '==', branch));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'vacancies');
    }
  },
  async createVacancy(data: any) {
    try {
      await addDoc(collection(db, 'vacancies'), {
        ...data,
        status: 'open',
        postedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vacancies');
    }
  }
};
