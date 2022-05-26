import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyA47C7QK3kORpU0IljPhnd7MvqCnHiMTBk",
  authDomain: "atlastrip-c0798.firebaseapp.com",
  projectId: "atlastrip-c0798",
  storageBucket: "atlastrip-c0798.appspot.com",
  messagingSenderId: "401123270953",
  appId: "1:401123270953:web:196310d0da3a0099205738"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth();
export const db = getFirestore();

export const register = async (email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const login = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export const signout = async () => {
  return await signOut(auth);
}