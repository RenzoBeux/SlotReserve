import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  IdTokenResult,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// TEMPORARY: Flag to bypass authentication
const BYPASS_AUTH = false;

export type UserRole = "OWNER" | "USER";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

// Sign in with email and password
export const signIn = (email: string, password: string) => {
  if (BYPASS_AUTH) {
    // Mock successful sign in
    return Promise.resolve({
      user: mockUser,
    });
  }
  return signInWithEmailAndPassword(auth, email, password);
};

// Create a new user with email and password
export const signUp = (email: string, password: string) => {
  if (BYPASS_AUTH) {
    // Mock successful sign up
    return Promise.resolve({
      user: mockUser,
    });
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign out
export const signOut = () => {
  if (BYPASS_AUTH) {
    // Mock successful sign out
    return Promise.resolve();
  }
  return firebaseSignOut(auth);
};

// Sign in with Google
export const signInWithGoogle = () => {
  if (BYPASS_AUTH) {
    return Promise.resolve({ user: mockUser });
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Mock user for bypassing authentication
const mockUser: User = {
  uid: "mock-user-id",
  email: "owner@example.com",
  displayName: "Mock User",
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: "",
  tenantId: null,
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve("mock-token"),
  getIdTokenResult: () =>
    Promise.resolve({
      token: "mock-token",
      signInProvider: "password",
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      authTime: new Date().toISOString(),
      claims: {},
      signInSecondFactor: null, // Adding the missing property
    } as IdTokenResult),
  reload: () => Promise.resolve(),
  toJSON: () => ({ uid: "mock-user-id" }),
  phoneNumber: null,
  photoURL: null,
  providerId: "password",
};

// Mock user data
const mockUserData: UserData = {
  uid: "mock-user-id",
  email: "owner@example.com",
  displayName: "Mock User",
  role: "OWNER", // Default to OWNER to see more functionality
};

// Custom hook to get the current user and role
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!BYPASS_AUTH);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (BYPASS_AUTH) {
      // Set mock user when bypassing authentication
      setCurrentUser(mockUser);
      setUserData(mockUserData);
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // In a real app, we would fetch the user's role from the backend
        // For now, we'll mock it with a hardcoded value
        // You should replace this with an actual API call
        const mockUserData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          // For demo purposes, give some users OWNER role
          role: user.email?.includes("owner") ? "OWNER" : "USER",
        };

        setUserData(mockUserData);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user: currentUser, userData, loading };
};

export { auth };
