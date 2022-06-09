type Play = "paper" | "rock" | "scissors";

const state = {
  data: {
    currentGame: {
      computerPlay: "",
      myPlay: "",
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

  setNameAndIdAtState(name, id, longId){
    const currentState= this.getState();
    currentState.gamer_1_name = name;
    currentState.gamer_1_shortId = id
    currentState.gamer_1_longId = longId;
    const newState = this.currentState;
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    this.savedData();
  },

  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  //SAVE THE SCORE AND SUMMON SAVE DATA
  setScore() {
    const currentState = this.getState();

    const myPlay = this.getState().currentGame.myPlay;
    const computerPlay = this.getState().currentGame.computerPlay;
    const currentWhoWins = this.whoWins(myPlay, computerPlay);

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

  whoWins(myPlay: Play, computerPlay: Play) {
    const tieS: boolean = myPlay == "scissors" && computerPlay == "scissors";
    const tieR: boolean = myPlay == "rock" && computerPlay == "rock";
    const tieP: boolean = myPlay == "paper" && computerPlay == "paper";
    const tie = [tieP, tieR, tieS].includes(true);

    if (tie) {
      return "tie";
    }

    const winS: boolean = myPlay == "scissors" && computerPlay == "paper";
    const winR: boolean = myPlay == "rock" && computerPlay == "scissors";
    const winP: boolean = myPlay == "paper" && computerPlay == "rock";
    const youWin = [winP, winR, winS].includes(true);

    if (youWin) {
      return "wins";
    } 

    const looseS: boolean = myPlay == "scissors" && computerPlay == "rock";
    const looseR: boolean = myPlay == "rock" && computerPlay == "paper";
    const looseP: boolean = myPlay == "paper" && computerPlay == "scissors";
    const youLoose = [looseS, looseR, looseP].includes(true);

    if (youLoose) {
      return "loss"
    }

  },

  //SAVE THE MOVEMENT AND SUMMON THE SCORE
  setMove(move: Play) {
    const currentState = this.getState();
    currentState.currentGame.myPlay = move;
    const machineMove = () => {
      const hands = ["scissors", "rock", "paper"];
      return hands[Math.floor(Math.random() * 3)];
    };
    currentState.currentGame.computerPlay = machineMove();
    this.setScore();
    return machineMove();
  },

  savedData() {
    const currentHistory = this.getState().history;
    localStorage.setItem("data", JSON.stringify(currentHistory));
  },
};

export { state };
