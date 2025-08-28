import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // use your firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { db, app, database, auth };