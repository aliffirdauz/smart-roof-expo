import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7PJwH2lR5xdDwH9C8cCcd7-ZPfVibRUI",
  authDomain: "esp32-firebase-75f9c.firebaseapp.com",
  databaseURL: "https://esp32-firebase-75f9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-firebase-75f9c",
  storageBucket: "esp32-firebase-75f9c.appspot.com",
  messagingSenderId: "695902682866",
  appId: "1:695902682866:web:8619d25ef0d3c00689da6b"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };