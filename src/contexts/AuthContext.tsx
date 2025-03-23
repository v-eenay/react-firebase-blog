import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
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
          photoURL: firebaseUser.photoURL || userData?.photoURL || null
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
      createdAt: new Date().toISOString()
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
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

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}