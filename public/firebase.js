// Import the functions you need from the SDKs you need
import * as firebase from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/ui/6.0.0/firebase-ui-auth.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAVEeeaWlRVt_LOjFVBNO_c9VUJPOr-wTo",
  authDomain: "krowdee-20.firebaseapp.com",
  databaseURL: "https://krowdee-20.firebaseio.com",
  projectId: "krowdee-20",
  storageBucket: "krowdee-20.appspot.com",
  messagingSenderId: "773810388934",
  appId: "1:773810388934:web:a367aa976ce609e05dfcc7",
  measurementId: "G-9N83LHJCG0",
};
const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth(app);

console.log(auth.GoogleAuthProvider, firebase);
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "<url-to-redirect-to-on-success>",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    auth.GoogleAuthProvider.PROVIDER_ID,
    auth.FacebookAuthProvider.PROVIDER_ID,
    auth.TwitterAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};
var ui = new firebaseui.auth.AuthUI(auth());
// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig);
// Initialize Firebase;
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
