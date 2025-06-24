// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHWRK3VZLAAritsM8APdmxdwS49O4fU5M",
  authDomain: "test-odoo-aeef1.firebaseapp.com",
  projectId: "test-odoo-aeef1",
  storageBucket: "test-odoo-aeef1.firebasestorage.app",
  messagingSenderId: "569040677094",
  appId: "1:569040677094:web:3a88fb03c4049a32183327"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };