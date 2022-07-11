"use strict";
exports.__esModule = true;
var express = require("express");
var state_1 = require("../Cliente/state");
var databaseAdmin_1 = require("./databaseAdmin");
var cors = require("cors");
var uuid_1 = require("uuid");
var app = express(); //Inicializamos express en alguna variable
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
var port = process.env.PORT || 3001;
//Collections refs
var userCollectionRef = databaseAdmin_1.firestoreAdmin.collection("Users");
var roomsCollectionRef = databaseAdmin_1.firestoreAdmin.collection("Rooms");
//Create a new user at Firestore
app.post("/signup", function (req, res) {
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    userCollectionRef.add({
        owner: true,
        userName: userName,
        userEmail: userEmail
    }).then(function (newUserRef) {
        res.status(200).json({
            userName: userName,
            userId: newUserRef.id,
            owner: true
        });
    });
});
//Authenticate user. If exists returns id
app.post("/auth", function (req, res) {
    var userEmail = req.body.userEmail;
    userCollectionRef.where("userEmail", "==", userEmail).get().then(function (searchResponse) {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "usuario no registrado."
            });
        }
        else {
            res.status(200).json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
// Create a room at Real Time Data Base if the user exists
app.post("/room", function (req, res) {
    var userId = req.body.userId;
    userCollectionRef.doc(userId).get().then(function (doc) {
        if (doc.exists) {
            //Create room at RealTimeDataBase
            var newRoomRef = databaseAdmin_1.rtdbAdmin.ref("Rooms/" + (0, uuid_1.v4)());
            var longRoomId_1 = newRoomRef.key;
            var shortRoomId_1 = 1000 + Math.floor(Math.random() * 999);
            newRoomRef.set({
                owner: userId,
                shortRoomId: shortRoomId_1,
                longRoomId: longRoomId_1,
                onlineOwner: true,
                onlineGuest: false
            }).then(function () {
                return res.json({
                    shortRoomId: shortRoomId_1,
                    longRoomId: longRoomId_1
                });
            }).then(function (response) { });
        }
        else {
            res.status(401).json({
                message: "El id no existe."
            });
        }
    });
});
// Create room at Firestore
var cs = state_1.state.getState();
app.post("/create_room_firestore", function (req, res) {
    var shortRtdbId = req.body.shortRtdbId;
    var longRtdbId = req.body.longRtdbId;
    roomsCollectionRef.add({
        shortRtdbId: shortRtdbId.toString(),
        longRtdbId: longRtdbId.toString()
    }).then(function (newUserRef) {
        res.status(200).json({
            message: "Room creado en Firestore"
        });
    });
});
//Verify shortID and return longID
app.post("/auth_room", function (req, res) {
    var shortRtdbId = req.body.shortRtdbId;
    roomsCollectionRef.where("shortRtdbId", "==", shortRtdbId.toString()).get().then(function (searchResponse) {
        if (!searchResponse.empty) {
            res.json({
                roomLongId: searchResponse.docs[0].get("longRtdbId")
            });
        }
        else {
            res.status(404).json({
                message: "no existe un room con ese id"
            });
        }
    });
});
// Conect user to a Real Time Data Base room and change inviteGuest flag
app.post("/enter_room", function (req, res) {
    var longRtdbtID = req.body.longRtdbtID;
    var chatRoomRef = databaseAdmin_1.rtdbAdmin.ref("/Rooms/" + longRtdbtID);
    chatRoomRef.on('value', function (snapshot) {
        console.log("Esto es lo que hay en rtdb", snapshot.val());
    }, function (errorObject) {
        console.log('The read failed: ' + errorObject.name);
    });
});
//Listen to a room at Real Time Data Base
app.post('/listen_room', function (req, res) {
    var longRtdbtID = req.body.longRtdbtID;
    var chatRoomRef = databaseAdmin_1.rtdbAdmin.ref("/Rooms/" + longRtdbtID);
    chatRoomRef.on('value', function (snapshot) {
        console.log("Esto es lo que hay en rtdb", snapshot.val());
        res.json(snapshot.val());
    }, function (errorObject) {
        console.log('The read failed: ' + errorObject.name);
    });
});
app.get('/change_status', function (req, res) {
    var longRtdbtID = req.body.longRtdbtID;
    var chatRoomRef = databaseAdmin_1.rtdbAdmin.ref("/Rooms/" + longRtdbtID);
    chatRoomRef.update({
        owner: true
    }, function () {
        console.log("Todo salio ok");
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
