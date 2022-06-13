"use strict";
exports.__esModule = true;
var express = require("express");
var databaseAdmin_1 = require("./databaseAdmin");
var nanoid_1 = require("nanoid");
var cors = require("cors");
var app = express(); //Inicializamos express en alguna variable
app.use(cors());
app.use(express.json());
app.use(express.static("../dist"));
var port = process.env.PORT || 3001;
var userCollectionRef = databaseAdmin_1.firestoreAdmin.collection("Users");
var roomsCollectionRef = databaseAdmin_1.firestoreAdmin.collection("Rooms");
(function main() {
    //Create a new user at Firestore if it does not exist
    app.post("/signup", function (req, res) {
        var userId = req.body.userId;
        var owner = req.body.owner;
        userCollectionRef.where("userId", "==", userId).get().then(function (searchResponse) {
            if (searchResponse.empty) {
                userCollectionRef.add({ userId: userId, owner: owner }).then(function (newUserRef) {
                    res.status(200).json({
                        userId: newUserRef.id,
                        "new": true
                    });
                    return newUserRef.id;
                });
            }
            else {
                res.status(400).json({
                    message: "Usuario registrado."
                });
            }
        });
    });
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
    app.post("/rooms", function (req, res) {
        var userId = req.body.userId;
        userCollectionRef.doc(userId.toString()).get().then(function (doc) {
            if (doc.exists) {
                var newRoomRef_1 = databaseAdmin_1.rtdbAdmin.ref("Rooms/" + (0, nanoid_1.nanoid)());
                newRoomRef_1.set({
                    owner: userId
                }).then(function () {
                    var roomLongId = newRoomRef_1.key;
                    var roomId = 1000 + Math.floor(Math.random() * 999);
                    roomsCollectionRef.doc(roomId.toString()).set({
                        rtdbRoomId: roomLongId
                    }).then(function () {
                        res.json({
                            id: roomId.toString()
                        });
                    });
                });
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
})();
