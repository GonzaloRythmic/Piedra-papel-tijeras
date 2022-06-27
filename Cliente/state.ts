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
      userEmail: "",
      gamer_1_name: "",
      gamer_1_rtdbId: "",
      game_1_longrtdbId: "",
      gamer_1_firestoreId: "",
      player1_move: "",
      gamer_2_name: "",
      player2_move: "",
      gamer_2_rtdbId: "",
      gamer_2_firestoreId: "",
    },
    history: {
      myScore: 0,
      computerScore: 0,
    },
  },
  listeners: [],

  // getStorage() {
  //   const local = JSON.parse(localStorage.getItem("data"));
  //   if (localStorage.getItem("data")) {
  //     return (this.data.history = local);
  //   }
  // },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    // this.savedData();
  },

  // savedData() {
  //   const currentHistory = this.getState().history;
  //   localStorage.setItem("data", JSON.stringify(currentHistory));
  // },

  setEmailAndName(email: string, name: string) {
    const currentState = this.getState();
    currentState.currentGame.userEmail = email;
    currentState.currentGame.gamer_1_name = name;
    this.setState(currentState);
  },

  setFirestoreId(id) {
    const currentState = this.getState();
    currentState.currentGame.gamer_1_firestoreId = id;
    this.setState(currentState);
  },

  setRtdbId(rtdbId) {
    const currentState = this.getState();
    currentState.currentGame.gamer_1_rtdbId = rtdbId;
    this.setState(currentState);
  },

  authentication(callback): Promise<any> {
    console.log("(10)Empieza authentication")
    const cs = this.getState();
    if (cs.currentGame.userEmail) {
      return fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: cs.currentGame.userEmail }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const cs = this.getState();
          cs.currentGame.gamer_1_firestoreId = data.id;
          state.setState(cs);
          callback();
          console.log("(11)Termina authentication")
        });
    } else {
      console.error("No existe el email");
    }
  },

  createUserAtFirestore():Promise<any> {
    console.log("(4)Comienza a ejecutar createUserAtFirestore")
    const cs = this.getState();
    const userName = cs.currentGame.gamer_1_name;
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
    }).then((res) => {
        return res.json();
      })
      .then((data) => {
        // cs.currentGame.gamer_1_firestoreId = data.userId;
        // this.setState(cs);
      
        console.log("(5)Termina de ejecutar createUserAtFirestore")
      });
  },

  createRoom(callback) {
    const cs = state.getState();
    console.log("Ejecuto createRoom y en el state encuentro esto", cs);
    if (cs.currentGame.gamer_1_firestoreId) {
      console.log("Entro por acá");
      return fetch(API_BASE_URL + "/room", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cs.currentGame.gamer_1_firestoreId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          // cs.currentGame.gamer_1_rtdbId = data.shortRoomId
        });
    } else {
      console.error("El id ingresado no existe");
    }
    console.log("Termino de ejecutar CreateRoom");
  },

  enterToRoom(userId: string, rtdbId: string): Promise<any> {
    return fetch(API_BASE_URL + "/room/:roomId", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        rtdbId: rtdbId,
      }),
    });
  },

  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  //SAVE THE SCORE AND SUMMON SAVE DATA
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
