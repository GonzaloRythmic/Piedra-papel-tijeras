"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.state = void 0;
var API_BASE_URL = "http://localhost:3001";
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
var state = {
    data: {
        currentGame: {
            userEmail: "",
            gamer_1_name: "",
            gamer_1_rtdbId: "",
            game_1_longrtdbId: "",
            gamer_1_firestoreId: "",
            player1_move: "",
            rtdbData: {}
        },
        history: {
            myScore: 0,
            computerScore: 0
        }
    },
    listeners: [],
    // getStorage() {
    //   const local = JSON.parse(localStorage.getItem("data"));
    //   if (localStorage.getItem("data")) {
    //     return (this.data.history = local);
    //   }
    // },
    getState: function () {
        return this.data;
    },
    setState: function (newState) {
        this.data = newState;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb();
        }
        // this.savedData();
    },
    // savedData() {
    //   const currentHistory = this.getState().history;
    //   localStorage.setItem("data", JSON.stringify(currentHistory));
    // },
    setEmailAndName: function (email, name) {
        var currentState = this.getState();
        currentState.currentGame.userEmail = email;
        currentState.currentGame.gamer_1_name = name;
        this.setState(currentState);
    },
    setFirestoreId: function (id) {
        var currentState = this.getState();
        currentState.currentGame.gamer_1_firestoreId = id;
        this.setState(currentState);
    },
    setRtdbId: function (rtdbId) {
        var currentState = this.getState();
        currentState.currentGame.gamer_1_rtdbId = rtdbId;
        this.setState(currentState);
    },
    authentication: function () {
        var cs = this.getState();
        if (cs.currentGame.userEmail) {
            return fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userEmail: cs.currentGame.userEmail })
            });
        }
        else {
            console.error("No existe el email");
        }
    },
    createUserAtFirestore: function () {
        var cs = this.getState();
        var userName = cs.currentGame.gamer_1_name;
        var userEmail = cs.currentGame.userEmail;
        return fetch(API_BASE_URL + "/signup", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: userName,
                userEmail: userEmail,
                owner: true
            })
        });
    },
    createRoom: function () {
        var cs = state.getState();
        if (cs.currentGame.gamer_1_firestoreId) {
            return fetch(API_BASE_URL + "/room", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: cs.currentGame.gamer_1_firestoreId
                })
            });
        }
        else {
            console.error("El id ingresado no existe");
        }
    },
    createRoomAtFirestore: function () {
        var cs = this.getState();
        if (cs.currentGame.gamer_1_rtdbId && cs.currentGame.game_1_longrtdbId) {
            return fetch(API_BASE_URL + "/create_room_firestore", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    shortRtdbId: cs.currentGame.gamer_1_rtdbId,
                    longRtdbId: cs.currentGame.game_1_longrtdbId
                })
            });
        }
        else {
            console.log("Faltan los Id's");
        }
    },
    listenDatabase: function (shortID) {
        console.log("Short ID", shortID);
        var cs = this.getState();
        return fetch(API_BASE_URL + '/auth_room', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                shortRtdbId: shortID
            })
        });
    },
    authenticateRoom: function (shortID) {
        var cs = this.getState();
        return fetch(API_BASE_URL + "/auth_room", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                shortRtdbId: cs.currentGame.gamer_1_rtdbId
            })
        });
    },
    // enterToRoom(): Promise<any> {
    //   const cs = this.getState();
    //   const userId = cs.currentGame.g 
    //   return fetch(API_BASE_URL + "/room/:roomId", {
    //     method: "POST",
    //     mode: "cors",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       userId: userId,
    //       rtdbId: rtdbId,
    //     }),
    //   });
    // },
    suscribe: function (callback) {
        this.listeners.push(callback);
    },
    //SAVE THE SCORE AND SUMMON SAVE DATA
    setScore: function () {
        var currentState = this.getState();
        var player1 = this.getState().currentGame.player1;
        var player2 = this.getState().currentGame.player2;
        var currentWhoWins = this.whoWins(player1, player2);
        var myScore = currentState.history.myScore;
        var computerScore = currentState.history.computerScore;
        if (currentWhoWins === "wins") {
            return this.setState(__assign(__assign({}, currentState), { history: {
                    myScore: myScore + 1,
                    computerScore: computerScore
                } }));
        }
        else if (currentWhoWins === "loss") {
            return this.setState(__assign(__assign({}, currentState), { history: {
                    myScore: myScore,
                    computerScore: computerScore + 1
                } }));
        }
    },
    whoWins: function (player1, player2) {
        var tieS = player1 == "scissors" && player2 == "scissors";
        var tieR = player1 == "rock" && player2 == "rock";
        var tieP = player1 == "paper" && player2 == "paper";
        var tie = [tieP, tieR, tieS].includes(true);
        if (tie) {
            return "tie";
        }
        var winS = player1 == "scissors" && player2 == "paper";
        var winR = player1 == "rock" && player2 == "scissors";
        var winP = player1 == "paper" && player2 == "rock";
        var youWin = [winP, winR, winS].includes(true);
        if (youWin) {
            return "wins";
        }
        var looseS = player1 == "scissors" && player2 == "rock";
        var looseR = player1 == "rock" && player2 == "paper";
        var looseP = player1 == "paper" && player2 == "scissors";
        var youLoose = [looseS, looseR, looseP].includes(true);
        if (youLoose) {
            return "loss";
        }
    },
    //SAVE THE MOVEMENT AND SUMMON THE SCORE
    setMove: function (move) {
        var currentState = this.getState();
        currentState.currentGame.player1 = move;
        var machineMove = function () {
            var hands = ["scissors", "rock", "paper"];
            return hands[Math.floor(Math.random() * 3)];
        };
        currentState.currentGame.player2 = machineMove();
        this.setScore();
        return machineMove();
    }
};
exports.state = state;
