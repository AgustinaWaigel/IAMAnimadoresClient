// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUYhUVK-UTwSgPMZe_TR1U1EHbftwPAfE",
  authDomain: "animadores-iam.firebaseapp.com",
  projectId: "animadores-iam",
  storageBucket: "animadores-iam.firebasestorage.app",
  messagingSenderId: "631574321630",
  appId: "1:631574321630:web:33dcb20a5a6bdc0725a54f",
  measurementId: "G-TVPX1XZFM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);