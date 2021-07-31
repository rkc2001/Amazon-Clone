import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaf3YBABD2wT71vq1L-c0Z3jpe96-w55g",
  authDomain: "clone-55d80.firebaseapp.com",
  projectId: "clone-55d80",
  storageBucket: "clone-55d80.appspot.com",
  messagingSenderId: "558200567893",
  appId: "1:558200567893:web:b2d1c797a2a6eeb2ca3cdc",
  measurementId: "G-W7RP51FXW7"
};

//Initialising app with firebase config
const firebaseApp = firebase.initializeApp(firebaseConfig);

//Initialising Data Base
const db = firebaseApp.firestore(); 

//variable to handle sign-in and stuff
const auth = firebase.auth();

export { db, auth };