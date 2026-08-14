// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiTqnuW8vw6lnuyhjmvkxX9-cwtK_Sr00",
  authDomain: "luxe-magnate-core.firebaseapp.com",
  projectId: "luxe-magnate-core",
  storageBucket: "luxe-magnate-core.firebasestorage.app",
  messagingSenderId: "1022726576448",
  appId: "1:1022726576448:web:eaff20da9bb1040ef9c2a5",
  measurementId: "G-CE8GP7ZYNW",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize Authentication & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Logged in user:", user.displayName, user.email);
    return user;
  } catch (error: any) {
    console.error("Authentication error:", error.code, error.message);
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("Iltimos, Firebase konsoliga kirib, Authentication -> Settings -> Authorized domains bo'limiga ushbu sayt manzilini qo'shing.");
    }
    if (error.code === 'auth/popup-closed-by-user' || error.message.includes('popup')) {
      throw new Error("Google orqali kirish oynasi yopildi. Iltimos, tepa o'ng burchakdagi 'Open in new tab' (Yangi oynada ochish) tugmasini bosib saytga kiring.");
    }
    throw error;
  }
};
