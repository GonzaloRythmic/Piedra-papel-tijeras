"use strict";
exports.__esModule = true;
exports.rtdbAdmin = exports.firestoreAdmin = void 0;
var admin = require("firebase-admin");
var lite_1 = require("firebase/firestore/lite");
var database_1 = require("firebase/database");
var serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://piedra-papel-tijeras-app-default-rtdb.firebaseio.com"
});
var firebaseConfig = {
    apiKey: "dAeSOjpHA1IjnFA18vDwdWOI2o6Rg0dRCcGz1W09",
    authDomain: "PROJECT_ID.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "739345696723",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: "G-MEASUREMENT_ID"
};
var firestoreAdmin = (0, lite_1.getFirestore)(admin);
exports.firestoreAdmin = firestoreAdmin;
var rtdbAdmin = (0, database_1.getDatabase)(admin);
exports.rtdbAdmin = rtdbAdmin;
