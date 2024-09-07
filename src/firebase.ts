// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD22HP6_MhmSUvz4pmDkwbJbrmAPM8FsUY",
  authDomain: "redstickr-13f4e.firebaseapp.com",
  projectId: "redstickr-13f4e",
  storageBucket: "redstickr-13f4e.appspot.com",
  messagingSenderId: "582590502250",
  appId: "1:582590502250:web:c45bd5912f5931afe64113",
  measurementId: "G-XK0N1SQJ8V"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export { app, db, auth }