import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Log the configuration (without sensitive values)
console.log('Firebase Config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId
});

let app;
let auth;
let db;
let storage;

try {
  // Validate required configuration
  if (!firebaseConfig.apiKey) {
    throw new Error('Missing Firebase API Key');
  }
  if (!firebaseConfig.authDomain) {
    throw new Error('Missing Firebase Auth Domain');
  }
  if (!firebaseConfig.projectId) {
    throw new Error('Missing Firebase Project ID');
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Create mock objects for development
  if (import.meta.env.DEV) {
    console.log('Creating mock Firebase objects for development');
    db = {
      collection: () => ({
        get: async () => ({ docs: [] }),
        add: async () => ({ id: 'mock-id' }),
        doc: () => ({
          get: async () => ({ data: () => ({}) }),
          set: async () => {},
          update: async () => {},
          delete: async () => {}
        })
      })
    };
    auth = {
      currentUser: null,
      onAuthStateChanged: () => () => {},
      signInWithEmailAndPassword: async () => ({ user: null }),
      createUserWithEmailAndPassword: async () => ({ user: null }),
      signOut: async () => {}
    };
    storage = {
      ref: () => ({
        put: async () => {},
        getDownloadURL: async () => ''
      })
    };
  }
}

export { auth, db, storage };