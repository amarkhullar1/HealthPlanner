import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT5LrblAwtZ6MPKm_105pf7xqBn7g1EEI",
  authDomain: "health-planner-bf067.firebaseapp.com",
  projectId: "health-planner-bf067",
  storageBucket: "health-planner-bf067.firebasestorage.app",
  messagingSenderId: "909115902249",
  appId: "1:909115902249:web:9dfa4f732f9fe6e96b4f38",
  measurementId: "G-XJ3H4P70R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;
