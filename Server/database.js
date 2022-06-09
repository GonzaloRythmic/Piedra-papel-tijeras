"use strict";
exports.__esModule = true;
exports.firestore = exports.rtdb = void 0;
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var firestore_1 = require("firebase/firestore");
// TODO: Replace with your app's Firebase project configuration
var firebaseConfig = {
    apiKey: "dAeSOjpHA1IjnFA18vDwdWOI2o6Rg0dRCcGz1W09",
    authDomain: "piedra-papel-tijeras-app.firebase.app",
    databaseURL: "https://piedra-papel-tijeras-app-default-rtdb.firebaseio.com/",
    projectId: "piedra-papel-tijeras-app"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
// Get a reference to the database service
var rtdb = (0, database_1.getDatabase)(app); //Real Time Data Base
exports.rtdb = rtdb;
var firestore = (0, firestore_1.getFirestore)(app); //Firestore
exports.firestore = firestore;
