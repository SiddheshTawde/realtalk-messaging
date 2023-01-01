// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuKQE-1zeihXDczrJ1opwmefmNFPiJte8",
  authDomain: "realtalk-messaging.firebaseapp.com",
  projectId: "realtalk-messaging",
  storageBucket: "realtalk-messaging.appspot.com",
  messagingSenderId: "62300300129",
  appId: "1:62300300129:web:7686732a20fb6a66085b20",
  measurementId: "G-5Z2P5J8DYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;