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



//Create a new user at Firestore
app.post("/signup", (req, res) => { 
  const {userName} = req.body;
  const {userEmail} = req.body
  userCollectionRef.add({ 
    owner: true, 
    userName: userName,
    userEmail: userEmail 
  }).then((newUserRef) => {
    res.status(200).json({
      userName: userName,
      userId: newUserRef.id,
      owner: true,
    });
  })
});
 

//Authenticate user. If exists returns id
app.post("/auth", (req, res) => {
  const { userEmail } = req.body;
  userCollectionRef.where("userEmail", "==", userEmail).get().then((searchResponse) => {
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
  userCollectionRef.doc(userId).get().then((doc) => {
    if (doc.exists) {
      //Create room at RealTimeDataBase
      const newRoomRef = rtdbAdmin.ref("Rooms/" + uuidv4());
      const longRoomId = newRoomRef.key;
      console.log("Soy el roomLongId", longRoomId);
      const shortRoomId = 1000 + Math.floor(Math.random() * 999);
      newRoomRef.set({
        owner: userId,
        shortRoomId : shortRoomId,
        longRoomId : longRoomId,
        online: true 
        }).then(() =>{
          return res.json({
          shortRoomId: shortRoomId,
          longRoomId: longRoomId 
        })
      }).then((response)=>{});
    } else {
      res.status(401).json({
        message: "El id no existe.",
      });
    }
  });
});


//verifica si existe la sala en base al short id:
app.post("/auth_room", (req, res) => {
  const { shortRoomId } = req.body;
  roomsCollectionRef.where("rtdbRoomId", "==", shortRoomId).get().then((searchResponse) => {
    if (!searchResponse.empty) {
      // const owner = searchResponse.docs[0].get("owner");
      res.json({
        roomLongId: searchResponse.docs[0].id,
        // owner,
      });
    } else {
      res.status(404).json({
        message: "no existe un room con ese id",
      });
    }
  });
});


// Conect user to a room
app.get("/enter_room/",  (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  userCollectionRef.doc(userId.toString()).get().then((doc) => {
    if (doc.exists) {
      console.log("Hola, el documento existe");
      roomsCollectionRef.doc(roomId).get().then((snap) => {
        console.log("Soy el snap", snap)
        if (snap.exists) {
          console.log("El documento sigue existiendo")
          const data = snap.data();
          res.json(data);
        } else {
          console.log("Entre por aca el documento no existe")
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

