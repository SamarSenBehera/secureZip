import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCr_XoDp3FV3KKAiKxc-GssgJWTTea1vgk",
  authDomain: "zip-73b41.firebaseapp.com",
  databaseURL: "https://zip-73b41-default-rtdb.firebaseio.com",
  projectId: "zip-73b41",
  storageBucket: "zip-73b41.firebasestorage.app",
  messagingSenderId: "786954510073",
  appId: "1:786954510073:web:a8156533d3982293774c28",
  measurementId: "G-C3DFVV1XYX",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)

export default app
