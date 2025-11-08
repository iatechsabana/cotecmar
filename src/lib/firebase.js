// Firebase initialization helper
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentMultipleTabManager, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with modern persistence settings
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  cache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    synchronizeTabs: true
  }),
  cacheSizeBytes: 50000000, // Aumentar el tamaño de la caché (50MB)
  retry: true, // Reintentar operaciones fallidas
});

// Initialize other services
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export initialized services
export { app, auth, db, storage, analytics };
