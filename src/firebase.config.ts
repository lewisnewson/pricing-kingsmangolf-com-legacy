// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBin6Nme7HzvHgdYe43DdgYmQWin6K-pww",
	authDomain: "pricing-kingsmangolf-com.firebaseapp.com",
	projectId: "pricing-kingsmangolf-com",
	storageBucket: "pricing-kingsmangolf-com.appspot.com",
	messagingSenderId: "267670357763",
	appId: "1:267670357763:web:45e9289cddf07c867f8b36",
	measurementId: "G-VRQ49BM6Z0",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
