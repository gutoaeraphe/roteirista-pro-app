// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRRZJvZw3D4TJrrw2kQATK0_yfpAHarZw",
  authDomain: "cmk-play-309116.firebaseapp.com",
  projectId: "cmk-play-309116",
  storageBucket: "cmk-play-309116.appspot.com",
  messagingSenderId: "303494539968",
  appId: "1:303494539968:web:341a456107a7927b801b25"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAILS = ['gutoaeraphe@yahoo.com.br', 'atendimento@cmkfilmes.com'];

export const handleEmailSignUp = async (name: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await updateProfile(user, {
    displayName: name
  });

  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: name,
      photoURL: user.photoURL || '',
      credits: 3,
      scriptDoctorMessagesRemaining: 0,
      isAdmin: ADMIN_EMAILS.includes(email),
  });

  return userCredential;
}
