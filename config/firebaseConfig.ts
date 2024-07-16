import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDzNN5sjMKInEOJwV4B5-GLQmEGMROpuVs",
    authDomain: "explore-nepal-c770f.firebaseapp.com",
    projectId: "explore-nepal-c770f",
    storageBucket: "explore-nepal-c770f.appspot.com",
    messagingSenderId: "256837909353",
    appId: "1:256837909353:web:4321123826c60e8f26dbf8",
    measurementId: "G-Q7FMCZ7F1L"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
