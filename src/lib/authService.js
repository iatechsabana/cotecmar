import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

// Configurar el proveedor de Google con los parámetros mínimos necesarios
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signInEmailPassword(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function signInWithGoogle() {
  try {
    console.log("Iniciando autenticación con Google (redirect)...");
    // Usar directamente el método de redirección
    await signInWithRedirect(auth, googleProvider);
    // No necesitamos retornar nada aquí ya que la página se recargará
  } catch (error) {
    console.error("Error en autenticación:", error);
    throw error;
  }
}

// Función para manejar el resultado del redirect
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error en redirect:", error);
    throw error;
  }
}

export async function signOut() {
  await firebaseSignOut(auth);
}
