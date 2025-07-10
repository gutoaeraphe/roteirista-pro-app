// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4s7PUNkQTJLT4e_ARP3G2sYgzjSj79k0",
  authDomain: "app-roteiro-cmk.firebaseapp.com",
  projectId: "app-roteiro-cmk",
  storageBucket: "app-roteiro-cmk.appspot.com",
  messagingSenderId: "18498990847",
  appId: "1:18498990847:web:6de1e846697bb0a5f112ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
