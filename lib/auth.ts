import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
  phone,
  address,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: `${firstName} ${lastName}` });
  await setDoc(doc(db, "users", credential.user.uid), {
    firstName,
    lastName,
    email,
    phone,
    address,
    createdAt: serverTimestamp(),
  });
  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}
