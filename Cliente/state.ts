import { rtdb, firestore } from "../Server/database";
import { ref, onValue } from "firebase/database";

const API_BASE_URL = "http://localhost:3001";

type Play = "paper" | "rock" | "scissors";
// export type cs = {
//   currentGame:{
//     userEmail:string,
//     gamer_1_name: string,
//     gamer_1_rtdbId: string,
//     gamer_1_firestoreId: string,
//     player1_move:string,
//     gamer_2_name: string,
//     player2_move: string,
//     gamer_2_rtdbId: string,
//     gamer_2_firestoreId: string,
//   },
//   history: {
//     myScore: number,
//     computerScore: number,
//   },
// }

const state = {
  data: {
    currentGame: {
      onlineOwer: false,
      online: false, 
      userEmail: "",
      name: "",
      rtdbId: "",
      longrtdbId: "",
      firestoreId: "",
      move:[{}],
      rtdbData: {}
    },
    history: {
      myScore: 0,
      computerScore: 0,
    },
  },
  listeners: [],

//Return this.data
  getState() {
    return this.data;
  },
//Set all state
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    // this.savedData();
  },
//Set email and name at state
  setEmailAndName(email: string, name: string) {
    const currentState = this.getState();
    currentState.currentGame.userEmail = email;
    currentState.currentGame.name = name;
    this.setState(currentState);
  }, 
//Set user firestoreID
  setFirestoreId(id) {
    const currentState = this.getState();
    currentState.currentGame.firestoreId = id;
    this.setState(currentState);
  },
//Set user  short RealTimeDataBaseID
  setRtdbId(rtdbId) {
    const currentState = this.getState();
    currentState.currentGame.rtdbId = rtdbId;
    this.setState(currentState);
  },
//Authenticate user. If exists returns id
  authentication(): Promise<any> {
    const cs = this.getState();
    if (cs.currentGame.userEmail) {
      return fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: cs.currentGame.userEmail }),
      })

    } else {
      console.error("No existe el email");
    }
  },
//Create a new user at Firestore
  createUserAtFirestore() {
    const cs = this.getState();
    const userName = cs.currentGame.name;
    const userEmail = cs.currentGame.userEmail;  
    return fetch(API_BASE_URL + "/signup", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        userEmail: userEmail,
        owner: true,
      }),
    })
  },
// Create a room if the user exists
  createRoom(){
    const cs = state.getState();
    if (cs.currentGame.firestoreId) {
      return fetch(API_BASE_URL + "/room", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cs.currentGame.firestoreId
        }),
      })
        
    } else {
      console.error("El id ingresado no existe");
    }
  },
//Create roomCollection at Firestore
  createRoomAtFirestore(){
    const cs = this.getState();
    if (cs.currentGame.rtdbId && cs.currentGame.longrtdbId) {
      return fetch(API_BASE_URL + "/create_room_firestore", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          shortRtdbId: cs.currentGame.rtdbId,
          longRtdbId: cs.currentGame.longrtdbId
        })
      })
    } else {
      console.log("Faltan los Id's")
    }
  },
//Conect to a room
  conectToRoom() {
    const cs = this.getState()
    if (cs.currentGame.longrtdbId){
      return fetch (API_BASE_URL + '/enter_room', {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          longRtdbtID: cs.currentGame.longrtdbId,
        })
      })
    } else {
      console.log("id no encontrado")
    }
  },

//Verify shortID and return longID
  authenticateRoom(shortID: string){
    const cs = this.getState()
    return fetch (API_BASE_URL + "/auth_room",{
      method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          shortRtdbId: shortID,
        })
      })
  },
 
//Listen to a room at Real Time Data Base
  listenToRoom() {
    const cs = this.getState()
    if (cs.currentGame.longrtdbId){
      return fetch (API_BASE_URL + '/listen_room', {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          longRtdbtID: cs.currentGame.longrtdbId,
        })
      })
    } else {
      console.log("id no encontrado")
    }
  },

  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  //Save score
  setScore() {
    const currentState = this.getState();

    const player1 = this.getState().currentGame.player1;
    const player2 = this.getState().currentGame.player2;
    const currentWhoWins = this.whoWins(player1, player2);

    const myScore = currentState.history.myScore;
    const computerScore = currentState.history.computerScore;

    if (currentWhoWins === "wins") {
      return this.setState({
        ...currentState,
        history: {
          myScore: myScore + 1,
          computerScore: computerScore,
        },
      });
    } else if (currentWhoWins === "loss") {
      return this.setState({
        ...currentState,
        history: {
          myScore: myScore,
          computerScore: computerScore + 1,
        },
      });
    }
  },
//Determinates who wins
  whoWins(player1: Play, player2: Play) {
    const tieS: boolean = player1 == "scissors" && player2 == "scissors";
    const tieR: boolean = player1 == "rock" && player2 == "rock";
    const tieP: boolean = player1 == "paper" && player2 == "paper";
    const tie = [tieP, tieR, tieS].includes(true);

    if (tie) {
      return "tie";
    }

    const winS: boolean = player1 == "scissors" && player2 == "paper";
    const winR: boolean = player1 == "rock" && player2 == "scissors";
    const winP: boolean = player1 == "paper" && player2 == "rock";
    const youWin = [winP, winR, winS].includes(true);

    if (youWin) {
      return "wins";
    }

    const looseS: boolean = player1 == "scissors" && player2 == "rock";
    const looseR: boolean = player1 == "rock" && player2 == "paper";
    const looseP: boolean = player1 == "paper" && player2 == "scissors";
    const youLoose = [looseS, looseR, looseP].includes(true);

    if (youLoose) {
      return "loss";
    }
  },

  //SAVE THE MOVEMENT AND SUMMON THE SCORE
  setMove(move: Play) {
    const currentState = this.getState();
    currentState.currentGame.player1 = move;
    const machineMove = () => {
      const hands = ["scissors", "rock", "paper"];
      return hands[Math.floor(Math.random() * 3)];
    };
    currentState.currentGame.player2 = machineMove();
    this.setScore();
    return machineMove();
  },
};

export { state };
