import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";

const avancesCol = collection(db, "avances");

export async function addAvance(avance) {
  const docRef = await addDoc(avancesCol, { ...avance, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getAvancesByUser(userId) {
  // Intentamos la consulta ordenada; si Firestore requiere un índice, hacemos un fallback
  try {
    const q = query(avancesCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Error común: "The query requires an index" -> fallback sin orderBy
    console.warn('getAvancesByUser: query with orderBy failed, retrying without orderBy', err);
    const q2 = query(avancesCol, where("userId", "==", userId));
    const snap2 = await getDocs(q2);
    return snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

export async function getAllAvances() {
  const snap = await getDocs(avancesCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addReproceso(avanceId, reproceso) {
  const avanceRef = doc(db, "avances", avanceId);
  await updateDoc(avanceRef, {
    reprocesos: arrayUnion({ ...reproceso, createdAt: serverTimestamp() }),
    horasInvertidas: increment(reproceso.horasAdicionales || 0),
  });
}

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function setUserProfile(uid, profile) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

// -------------------------
// Productividad events
// -------------------------
import { collection as _collection } from "firebase/firestore";

const productividadCol = _collection(db, "productividad");

export async function addProductividadEvent(evento) {
  const docRef = await addDoc(productividadCol, { ...evento, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getProductividadEvents() {
  try {
    const q = query(productividadCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('getProductividadEvents: orderBy failed, retrying without orderBy', err);
    const snap = await getDocs(productividadCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}
