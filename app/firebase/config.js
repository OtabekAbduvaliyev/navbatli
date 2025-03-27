import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA2bcu41mCSMeRHwfC4S5BE3vrb8dL-BQ8",
    authDomain: "navbatli.firebaseapp.com",
    projectId: "navbatli",
    storageBucket: "navbatli.firebasestorage.app",
    messagingSenderId: "543570295096",
    appId: "1:543570295096:web:5c507221f1389b7253a9cd",
    measurementId: "G-XXPSHTSV32"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
