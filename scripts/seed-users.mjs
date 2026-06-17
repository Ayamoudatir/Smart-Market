import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCqTLj7GLMhA6i7CF3iozwGoSYTPoaVgfA",
  authDomain: "kenzimarket.firebaseapp.com",
  projectId: "kenzimarket",
  storageBucket: "kenzimarket.firebasestorage.app",
  messagingSenderId: "581393698454",
  appId: "1:581393698454:web:41c16eba28b63ff075fcb7",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const USERS = [
  { firstName: 'Yassine', lastName: 'Admin',      email: 'admin@kenzi.ma',       password: 'kenzi123', role: 'admin',       phone: '+212 6 00 00 00 01', address: 'Casablanca' },
  { firstName: 'Karim',   lastName: 'Manager',    email: 'manager@kenzi.ma',     password: 'kenzi123', role: 'manager',     phone: '+212 6 00 00 00 02', address: 'Casablanca' },
  { firstName: 'Omar',    lastName: 'Prep',       email: 'preparateur@kenzi.ma', password: 'kenzi123', role: 'preparateur', phone: '+212 6 00 00 00 03', address: 'Casablanca' },
  { firstName: 'Hassan',  lastName: 'Livreur',    email: 'livreur@kenzi.ma',     password: 'kenzi123', role: 'livreur',     phone: '+212 6 00 00 00 04', address: 'Casablanca' },
  { firstName: 'Fatima',  lastName: 'Cliente',    email: 'client@kenzi.ma',      password: 'kenzi123', role: 'client',      phone: '+212 6 00 00 00 05', address: 'Derb El Hajja, Habous, Casablanca' },
]

for (const u of USERS) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, u.email, u.password)
    await updateProfile(cred.user, { displayName: `${u.firstName} ${u.lastName}` })
    await setDoc(doc(db, 'users', cred.user.uid), {
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      address: u.address,
      role: u.role,
      createdAt: serverTimestamp(),
    })
    console.log(`✓ ${u.role.padEnd(12)} ${u.email}`)
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`⚠ déjà existant   ${u.email}`)
    } else {
      console.error(`✗ ${u.email}:`, err.message)
    }
  }
}

console.log('\nDone. Mot de passe universel : kenzi123')
process.exit(0)
