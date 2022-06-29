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
// Create a room if the user exists
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
                online: true
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
        shortRtdbId: shortRtdbId,
        longRtdbId: longRtdbId
    }).then(function (newUserRef) {
        res.status(200).json({
            message: "Room creado en Firestore"
        });
    });
});
//Verify shortID and return longID
app.post("/auth_room", function (req, res) {
    var shortRtdbId = req.body.shortRtdbId;
    console.log(shortRtdbId);
    roomsCollectionRef.where("shortRtdbId", "==", shortRtdbId).get().then(function (searchResponse) {
        if (!searchResponse.empty) {
            res.json({
                roomLongId: searchResponse.docs[0].get("longRtdbId")
            });
        }
        else {
            res.status(404).json({
                message: "no existe un room con ese id",
                searchResponse: searchResponse
            });
        }
    });
});
// Conect user to a room
app.get("/enter_room/", function (req, res) {
    var userId = req.body.userId;
    var shortRoomId = req.body.shortRoomId;
    userCollectionRef.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            console.log("Hola, el documento existe");
            roomsCollectionRef.doc(shortRoomId).get().then(function (snap) {
                console.log("Soy el snap", snap);
                if (snap.exists) {
                    console.log("El documento sigue existiendo");
                    var data = snap.data();
                    res.json(data);
                }
                else {
                    console.log("Entre por aca el documento no existe");
                    res.status(401).json({
                        message: "El room indicado no existe."
                    });
                }
            });
        }
        else {
            res.status(401).json({
                message: "El id no existe."
            });
        }
    });
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
