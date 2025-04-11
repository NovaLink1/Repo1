import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCwjWWqjftAyHyTVs9PL8YKBytLdyLmXKs",
    authDomain: "novalink-ca3c3.firebaseapp.com",
    projectId: "novalink-ca3c3",
    storageBucket: "novalink-ca3c3.firebasestorage.app",
    messagingSenderId: "759320761469",
    appId: "1:759320761469:web:4f8e066555d450d8decd14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
