import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDDydFrdrrJ_Voxms5XGmTUnY6VoXTzBQw",
  authDomain: "foody-photo-app.firebaseapp.com",
  databaseURL: "https://foody-photo-app.firebaseio.com",
  projectId: "foody-photo-app",
  storageBucket: "foody-photo-app.appspot.com",
  messagingSenderId: "797933462603",
  appId: "1:797933462603:web:5d4287415876a58d1cd9ce",
  measurementId: "G-4PF6Z169BT",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
