import *as express from "express"
import { state } from "../Cliente/state";
import {rtdbAdmin, firestoreAdmin} from "./databaseAdmin";
import { getFirestore, getDoc, addDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import * as e from "express";
import * as cors from "cors";
import { v4 as uuidv4 } from 'uuid';



const app = express(); //Inicializamos express en alguna variable
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"))

const port = process.env.PORT || 3001;

const userCollectionRef = firestoreAdmin.collection("Users");
const roomsCollectionRef = firestoreAdmin.collection("Rooms");



  //Create a new user at Firestore if it does not exist
  app.post("/signup", (req, res) => { 
    const {userName} = req.body;
        userCollectionRef.add({ 
          owner: true, 
          userName: userName 
        }).then((newUserRef) => {
          res.status(200).json({
            userName: userName,
            userId: newUserRef.id,
            owner: true,
          });
        })
    });
 ;

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
  app.post("/room", (req, res) => {
    const { userId } = req.body;
    const {userName} = req.body;
    userCollectionRef.doc(userId).get().then((doc) => {
      if (doc.exists) {
        const newRoomRef = rtdbAdmin.ref("Rooms/" + uuidv4());
        // const roomLongId = newRoomRef.key;
        const roomId = 1000 + Math.floor(Math.random() * 999);
        newRoomRef.set({
          owner: userId,
          userName : userName,
          rtdbId : roomId,
          online: true 
          }).then(() =>{
          return res.json({
            message: "El id del RTDB es" + roomId,
            rtdbId: roomId 
          })
        }).then((response)=>{});
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

