
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "dAeSOjpHA1IjnFA18vDwdWOI2o6Rg0dRCcGz1W09",
  authDomain: "piedra-papel-tijeras-app.firebase.app",
  databaseURL: "https://piedra-papel-tijeras-app-default-rtdb.firebaseio.com/",
  projectId: "piedra-papel-tijeras-app",
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const rtdb = getDatabase(app); //Real Time Data Base
const firestore = getFirestore(app) //Firestore


export {rtdb, firestore}; 