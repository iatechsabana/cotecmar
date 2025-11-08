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
  const q = query(avancesCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
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
