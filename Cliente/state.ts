import { rtdb, firestore } from "../Server/database";
import { ref, onValue } from "firebase/database";

const API_BASE_URL = "http://localhost:3001";

type Play = "paper" | "rock" | "scissors";

const state = {
  data: {
    currentGame: {
      player2_move: "",
      player1_move: "",
      gamer_1_name: "",
      gamer_2_name: "",
      gamer_1_shortId: "",
      gamer_2_shortId:"",
      gamer_1_longId: "",
      gamer_2_longId:""
    },
    history: {
      myScore: 0,
      computerScore: 0,
    },
  },
  listeners: [],

  getStorage() {
    const local = JSON.parse(localStorage.getItem("data"));
    if (localStorage.getItem("data")) {
      return (this.data.history = local);
    }
  },

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    // for (const cb of this.listeners) {
    //   cb();
    // }
    // this.savedData();
  },

  // savedData() {
  //   const currentHistory = this.getState().history;
  //   localStorage.setItem("data", JSON.stringify(currentHistory));
  // },

  setName(name){
    const currentState= this.getState();
    currentState.currentGame.gamer_1_name = name;
    const newState = currentState;
    this.setState(newState);
    console.log("Yo soy el nuevo state", currentState.currentGame);
  },

  authentication(userId){
    return fetch("/auth", {
      method: "post",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId
      })
    })
  },

  createUser(callback?, userId?) {
      fetch(API_BASE_URL + "/signup" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      })
        .then(data => {
          return data.json();
          console.log(data);
        })
        .then(res => {
         console.log("Soy el res", res);
          // this.setState(cs)
        });
  },

  // createNewRoom(userId, user){
  //   return fetch("/room", {
  //     method: "post",
  //     headers: {
  //       "content-type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       userId: userId,
  //       owner: user
  //     })
  //     })
  // },

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
      return "loss"
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
