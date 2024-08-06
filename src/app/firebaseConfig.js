// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRtAu84TpTpwGI9ZXMTg6q9nIHZ3fKvUY",
  authDomain: "inventory-management-74b66.firebaseapp.com",
  projectId: "inventory-management-74b66",
  storageBucket: "inventory-management-74b66.appspot.com",
  messagingSenderId: "217538906470",
  appId: "1:217538906470:web:c8ec07eaa3195b6010a0a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };