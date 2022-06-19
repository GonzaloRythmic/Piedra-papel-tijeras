import { rtdb, firestore } from "../Server/database";
import { ref, onValue } from "firebase/database";

const API_BASE_URL = "http://localhost:3001";

type Play = "paper" | "rock" | "scissors";
export type cs = {
  currentGame:{
    player2_move: string,
    player1_move:string,
    gamer_1_name: string,
    gamer_2_name: string,
    gamer_1_rtdbId: string,
    gamer_2_rtdbId: string,
    gamer_1_firestoreId: string,
    gamer_2_firestoreId: string,
  },
  history: {
    myScore: number,
    computerScore: number,
  },
}

const state = {
  data: {
    currentGame: {
      player2_move: "",
      player1_move: "",
      gamer_1_name: "",
      gamer_2_name: "",
      gamer_1_rtdbId: "",
      gamer_2_rtdbId:"",
      gamer_1_firestoreId: "",
      gamer_2_firestoreId:""
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

  getState():cs {
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
  },

  setId(id){
    const currentState= this.getState();
    currentState.currentGame.gamer_1_firestoreId = id;
    const newState = currentState;
    this.setState(newState);
  },

  setRtdbId(rtdbId){
    const currentState= this.getState();
    currentState.currentGame.gamer_1_rtdbId = rtdbId;
    const newState = currentState;
    this.setState(newState);
  },

  // authentication(userId){
  //   return fetch("/auth", {
  //     method: "post",
  //     headers:{
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId: userId
  //     })
  //   })
  // },

  createUser(userName: string): Promise <void>{
    return fetch(API_BASE_URL + "/signup" , {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName, 
        owner: true }),
    })
      .then(data => {
        return data.json();
      })
      .then((res)=>{
        const newUserId = res.userId;
        const newUserName = res.userName;
        this.setId(newUserId);
        this.setName(newUserName);
        const cs = this.getState();
      });
      
  },


  createRoom(userId:string, userName:string): Promise <void>{ 
    return fetch (API_BASE_URL + "/room", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        userName: userName, 
      })
    }).then(data => {
       return data.json()
    }).then((res)=>{
      console.log(res.rtdbId)
      this.setRtdbId(res.rtdbId);
      const cs = this.getState();
      console.log("vengo del create room", cs)
      return cs
    })
    const cs = this.getState();
    return cs
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
