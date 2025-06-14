import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkawgad8jv11hhP8MaL8teaCzupoF4R5w",
  authDomain: "codeastra-b1382.firebaseapp.com",
  projectId: "codeastra-b1382",
  storageBucket: "codeastra-b1382.firebasestorage.app",
  messagingSenderId: "325832333428",
  appId: "1:325832333428:web:0f22c17894688fbbc7d921",
  measurementId: "G-KV18BBDXN3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
