import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";

const usersCollection = collection(db, "users");

export const ROLES = {
  LIDER: "lider",
  MODELISTA: "modelista",
  PENDIENTE: "pendiente" // Para usuarios recién registrados
};

// Verificar el estado de la conexión
const isOnline = () => {
  return window.navigator.onLine;
};

// Obtener datos del localStorage
const getLocalUser = (uid) => {
  try {
    const userData = localStorage.getItem(`user_${uid}`);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Error al leer datos locales:', error);
    return null;
  }
};

// Guardar datos en localStorage
const saveLocalUser = (uid, userData) => {
  try {
    localStorage.setItem(`user_${uid}`, JSON.stringify(userData));
  } catch (error) {
    console.warn('Error al guardar datos locales:', error);
  }
};

// Obtener un usuario por ID
export async function getUser(uid) {
  try {
    // Primero intentar obtener datos del caché local
    const localData = getLocalUser(uid);
    
    // Si estamos offline, usar datos locales
    if (!isOnline()) {
      if (localData) {
        console.log('Usando datos offline del caché local');
        return { ...localData, offline: true };
      }
      // Si no hay datos locales, crear un perfil temporal
      return {
        id: uid,
        rol: ROLES.MODELISTA,
        offline: true,
        temporary: true
      };
    }

    // Si estamos online, intentar obtener datos de Firestore
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const user = {
        id: userDoc.id,
        ...userData,
        offline: false
      };
      // Guardar en caché local
      saveLocalUser(uid, user);
      return user;
    }
    
    // Si el usuario no existe en Firestore pero tenemos datos locales
    if (localData) {
      return { ...localData, offline: true };
    }
    
    // Si no hay datos ni en Firestore ni local, retornar null
    return null;
    
  } catch (error) {
    console.warn('Error al obtener usuario:', error);
    
    // Si hay error de conectividad y tenemos datos locales, usarlos
    if (localData) {
      return { ...localData, offline: true };
    }
    
    // Si no hay datos locales, crear perfil temporal
    if (error.code === 'failed-precondition' || 
        error.code === 'unavailable' || 
        error.message.includes('offline')) {
      return {
        id: uid,
        rol: ROLES.MODELISTA,
        offline: true,
        temporary: true
      };
    }
    
    throw error;
  }
}

// Obtener todos los usuarios
export async function getAllUsers() {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener usuarios por rol
export async function getUsersByRole(role) {
  const q = query(usersCollection, where("rol", "==", role));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Crear o actualizar un usuario
export async function updateUser(uid, userData) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// Actualizar el rol de un usuario
export async function updateUserRole(uid, newRole) {
  if (!Object.values(ROLES).includes(newRole)) {
    throw new Error("Rol inválido");
  }
  
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    rol: newRole,
    updatedAt: serverTimestamp(),
  });
}

// Crear un nuevo usuario
export async function createNewUser(uid, userData) {
  const userRef = doc(db, "users", uid);
  const newUserData = {
    ...userData,
    rol: userData.rol || ROLES.MODELISTA,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  try {
    await setDoc(userRef, newUserData);
    // Verificar que el documento se guardó correctamente
    const writtenDoc = await getDoc(userRef);
    if (!writtenDoc.exists()) {
      throw new Error('No se pudo guardar el usuario en Firestore');
    }
    const saved = { id: writtenDoc.id, ...writtenDoc.data() };
    // Guardar en caché local
    saveLocalUser(uid, {
      ...saved,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return saved;
  } catch (error) {
    if (!isOnline()) {
      // Si estamos offline, guardar solo en caché local
      saveLocalUser(uid, {
        ...newUserData,
        id: uid,
        offline: true,
        pendingSync: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: uid, ...newUserData, offline: true, pendingSync: true };
    } else {
      throw error;
    }
  }
}

// Sincronizar usuarios pendientes guardados en localStorage cuando se recupere la conexión
export async function syncPendingUsers() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('user_'));
  const results = [];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      if (!data.pendingSync) continue;

      const uid = data.id || key.replace('user_', '');
      const userRef = doc(db, 'users', uid);

      // Remove local-only flags before sending
      const payload = { ...data };
      delete payload.pendingSync;
      delete payload.offline;
      delete payload.id;

      await setDoc(userRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });

      // Mark as synced locally
      const synced = { ...data, pendingSync: false, offline: false, updatedAt: new Date().toISOString() };
      saveLocalUser(uid, synced);
      results.push({ uid, status: 'synced' });
    } catch (err) {
      console.warn('Error sincronizando usuario pendiente', key, err);
      results.push({ key, status: 'error', error: err });
    }
  }

  return results;
}

export function startPendingSyncListener() {
  // If online now, attempt immediate sync
  if (window && window.navigator && window.navigator.onLine) {
    syncPendingUsers().catch(err => console.warn('Error en syncPendingUsers inicial:', err));
  }

  window.addEventListener('online', () => {
    syncPendingUsers().catch(err => console.warn('Error en syncPendingUsers on online:', err));
  });
}