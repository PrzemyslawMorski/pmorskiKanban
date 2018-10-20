import * as firebase from "firebase";

export function setupFirebase() {
  const config = {
    apiKey: "AIzaSyDaUHVi_rFdTLYH3GTgRKEAGpJkcT2IMOY",
    authDomain: "pmorskikanban.firebaseapp.com",
    databaseURL: "https://pmorskikanban.firebaseio.com",
    messagingSenderId: "81914965876",
    projectId: "pmorskikanban",
    storageBucket: "pmorskikanban.appspot.com",
  };

  firebase.initializeApp(config);
}
