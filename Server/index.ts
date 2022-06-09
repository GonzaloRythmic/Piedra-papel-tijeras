import *as express from "express"
import {rtdbAdmin, firestoreAdmin} from "./databaseAdmin";
import { rtdb, firestore } from "./database";
import { getFirestore, getDoc, addDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import * as e from "express";



const app = express(); //Inicializamos express en alguna variable.
app.use(express.json());
const port = process.env.PORT || 3001;


( async function main(){
    app.post("/signup", async (req, res)=>{
      const email = req.body.email;
      const name = req.body.name;
      const q = query(collection(firestore, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(firestore, "Users"), {
          name: name,
          email: email
        });
        res.json({message:"salió todo ok"})
      } else {
        const user_id = querySnapshot.docs[0].id
        res.json({id: user_id});
      }
    })
    

    app.post("/auth", async (req, res)=>{
      const { email } = req.body;
      const q = query(collection(firestore, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        res.status(404).json({message: "User not found"});
      } else {
        const user_id = querySnapshot.docs[0].id
        res.json({id: user_id});
      }
    })
    

    app.post("/rooms", async (req, res)=>{
      const { userId } = req.body;
      const docRef = doc(firestore,"Users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        set(ref(rtdb, 'rooms' + "GeRmmAiDqcS3mLNjuECR"), {
          name: "name",
          email: "email",
          owner: userId
        })
        res.json({message: "Todo salio ok"});
      } else {
        res.status(401).json({message: "ERROR"})
      }
    })


    //EndPoints
    app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })

    // //Seguir agregando endpoints....
})()
