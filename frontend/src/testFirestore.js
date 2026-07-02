import { db } from './config/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function test() {
  try {
    console.log("Testing Firestore...");
    const payload = { test: true, time: serverTimestamp() };
    const docRef = await addDoc(collection(db, 'testCollection'), payload);
    console.log("Success! Doc written with ID:", docRef.id);
  } catch (error) {
    console.error("Firestore Error:", error.message);
    console.error(error);
  }
}

test();
