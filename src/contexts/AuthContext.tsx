import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { jsonService } from '../services/jsonService';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: 'user' | 'admin';
  status?: 'active' | 'banned';
  createdAt?: string;
  updatedAt?: string;
  followers?: string[];
  following?: string[];
  pinnedPosts?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userData?.displayName || null,
          photoURL: firebaseUser.photoURL || userData?.photoURL || null,
          role: userData?.role || 'user',
          status: userData?.status || 'active',
          createdAt: userData?.createdAt,
          updatedAt: userData?.updatedAt
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(firebaseUser, { displayName: name });
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      displayName: name,
      email,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    });
  };

  const login = async (email: string, password: string) => {
    try {
      // First try JSON authentication
      try {
        const jsonUser = jsonService.authenticateUser(email, password);
        if (jsonUser) {
          setUser({
            uid: jsonUser.id.toString(),
            email: jsonUser.email,
            displayName: jsonUser.name,
            photoURL: jsonUser.avatar,
            role: jsonUser.role as 'user' | 'admin',
            status: 'active',
            createdAt: jsonUser.createdAt
          });
          return;
        }
      } catch (jsonError) {
        console.log('JSON authentication failed, trying Firebase:', jsonError);
      }
      
      // If JSON auth fails, try Firebase
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Authentication error:', error);
      throw error instanceof Error ? error : new Error('Authentication failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, { displayName, photoURL: photoURL || null });
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      displayName,
      photoURL: photoURL || null,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setUser((prev) => prev ? { ...prev, displayName, photoURL: photoURL || null } : null);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user: firebaseUser } = await signInWithPopup(auth, provider);
    if (!firebaseUser.email) return;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
      });
    }
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const { user: firebaseUser } = await signInWithPopup(auth, provider);
    if (!firebaseUser.email) return;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
      });
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}