import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDaUHVi_rFdTLYH3GTgRKEAGpJkcT2IMOY",
  authDomain: "pmorskikanban.firebaseapp.com",
  databaseURL: "https://pmorskikanban.firebaseio.com",
  projectId: "pmorskikanban",
  storageBucket: "pmorskikanban.appspot.com",
  messagingSenderId: "81914965876"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
