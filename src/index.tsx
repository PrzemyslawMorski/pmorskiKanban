import * as firebase from "firebase";
import * as React from "react";
import { render } from "react-dom";
import { Root } from "./components/Root";

import "./style.css";

const config = {
  apiKey: "AIzaSyDaUHVi_rFdTLYH3GTgRKEAGpJkcT2IMOY",
  authDomain: "pmorskikanban.firebaseapp.com",
  databaseURL: "https://pmorskikanban.firebaseio.com",
  messagingSenderId: "81914965876",
  projectId: "pmorskikanban",
  storageBucket: "pmorskikanban.appspot.com",
};

firebase.initializeApp(config);

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     // User is signed in.
//     // const displayName = user.displayName;
//     // const email = user.email;
//     // const emailVerified = user.emailVerified;
//     // const photoURL = user.photoURL;
//     // const isAnonymous = user.isAnonymous;
//     // const uid = user.uid;
//     // const providerData = user.providerData;
//   } else {
//     // User is signed out.
//   }
// });

render(<Root />, document.getElementById("root"));
