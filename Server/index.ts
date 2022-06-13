import *as express from "express"
import {rtdbAdmin, firestoreAdmin} from "./databaseAdmin";
import { getFirestore, getDoc, addDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import * as e from "express";
import * as cors from "cors";



const app = express(); //Inicializamos express en alguna variable
app.use(cors());
app.use(express.json());
app.use(express.static("../dist"))

const port = process.env.PORT || 3001;

const userCollectionRef = firestoreAdmin.collection("Users");
const roomsCollectionRef = firestoreAdmin.collection("Rooms");


( function main(){
  //Create a new user at Firestore if it does not exist
  app.post("/signup", (req, res) => {
    const {userId} = req.body;
    const {owner} = req.body;
    userCollectionRef.where("userId", "==", userId).get().then((searchResponse) => {
      if (searchResponse.empty) {
        userCollectionRef.add({ userId: userId, owner: owner }).then((newUserRef) => {
          res.status(200).json({
            userId: newUserRef.id,
            new: true,
          });
          return newUserRef.id;
        });
      } else {
        res.status(400).json({
          message:
          "Usuario registrado.",
        });
      }
    });
  });

  //Authenticate user. If exists returns id
  app.post("/auth", (req, res) => {
    const { userId } = req.body;
    userCollectionRef.where("userid", "==", userId).get().then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message:
          "usuario no registrado.",
        });
      } else {
        res.status(200).json({
          id: searchResponse.docs[0].id,
        });
      }
    });
  });
    
// Create a room if the user exists
  app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    userCollectionRef.doc(userId.toString()).get().then((doc) => {
      if (doc.exists) {
        const newRoomRef = rtdbAdmin.ref("Rooms/" + nanoid());
        newRoomRef.set({
          owner: userId,
        }).then(() => {
          const roomLongId = newRoomRef.key;
          const roomId = 1000 + Math.floor(Math.random() * 999);
          roomsCollectionRef.doc(roomId.toString()).set({
            rtdbRoomId: roomLongId,
          }).then(() => {
            res.json({
              id: roomId.toString(),
            });
          });
        });
      } else {
        res.status(401).json({
          message: "El id no existe.",
        });
      }
    });
  });


// Conect user to a room
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  userCollectionRef.doc(userId.toString()).get().then((doc) => {
    if (doc.exists) {
      roomsCollectionRef.doc(roomId).get().then((snap) => {
        if (snap.exists) {
          const data = snap.data();
          res.json(data);
        } else {
          res.status(401).json({
            message: "El room indicado no existe.",
          });
        }
      });
    } else {
      res.status(401).json({
        message: "El id no existe.",
      });
    }
  });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
})()
