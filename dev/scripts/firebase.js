import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBFQkBD6HwqQt4dp8Ons8y8vlL4Ig6JsnQ",
  authDomain: "photo-rating-project.firebaseapp.com",
  databaseURL: "https://photo-rating-project.firebaseio.com",
  projectId: "photo-rating-project",
  storageBucket: "photo-rating-project.appspot.com",
  messagingSenderId: "599886236917"
};
firebase.initializeApp(config);

export default firebase;