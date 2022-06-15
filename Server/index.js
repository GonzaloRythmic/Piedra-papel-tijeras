"use strict";
exports.__esModule = true;
var express = require("express");
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
//Create a new user at Firestore if it does not exist
app.post("/signup", function (req, res) {
    var userName = req.body.userName;
    userCollectionRef.add({ owner: true, userName: userName }).then(function (newUserRef) {
        res.status(200).json({
            userName: userName,
            userId: newUserRef.id,
            owner: true
        });
    });
});
;
//Authenticate user. If exists returns id
app.post("/auth", function (req, res) {
    var userId = req.body.userId;
    userCollectionRef.where("userid", "==", userId).get().then(function (searchResponse) {
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
    var userName = req.body.userName;
    userCollectionRef.doc(userId).get().then(function (doc) {
        if (doc.exists) {
            var newRoomRef = databaseAdmin_1.rtdbAdmin.ref("Rooms/" + (0, uuid_1.v4)());
            // const roomLongId = newRoomRef.key;
            var roomId_1 = 1000 + Math.floor(Math.random() * 999);
            newRoomRef.set({
                owner: userId,
                userName: userName,
                rtdbId: roomId_1,
                online: true
            }).then(function () { return res.json({ message: "El id del RTDB es" + roomId_1 }); });
        }
        else {
            res.status(401).json({
                message: "El id no existe."
            });
        }
    });
});
// Conect user to a room
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    userCollectionRef.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            roomsCollectionRef.doc(roomId).get().then(function (snap) {
                if (snap.exists) {
                    var data = snap.data();
                    res.json(data);
                }
                else {
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
