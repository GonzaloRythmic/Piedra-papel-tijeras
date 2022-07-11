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
            onlineOwer: false,
            online: false,
            userEmail: "",
            name: "",
            rtdbId: "",
            longrtdbId: "",
            firestoreId: "",
            move: [{}],
            rtdbData: {}
        },
        history: {
            myScore: 0,
            computerScore: 0
        }
    },
    listeners: [],
    //Return this.data
    getState: function () {
        return this.data;
    },
    //Set all state
    setState: function (newState) {
        this.data = newState;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb();
        }
        // this.savedData();
    },
    //Set email and name at state
    setEmailAndName: function (email, name) {
        var currentState = this.getState();
        currentState.currentGame.userEmail = email;
        currentState.currentGame.name = name;
        this.setState(currentState);
    },
    //Set user firestoreID
    setFirestoreId: function (id) {
        var currentState = this.getState();
        currentState.currentGame.firestoreId = id;
        this.setState(currentState);
    },
    //Set user  short RealTimeDataBaseID
    setRtdbId: function (rtdbId) {
        var currentState = this.getState();
        currentState.currentGame.rtdbId = rtdbId;
        this.setState(currentState);
    },
    //Authenticate user. If exists returns id
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
    //Create a new user at Firestore
    createUserAtFirestore: function () {
        var cs = this.getState();
        var userName = cs.currentGame.name;
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
    // Create a room if the user exists
    createRoom: function () {
        var cs = state.getState();
        if (cs.currentGame.firestoreId) {
            return fetch(API_BASE_URL + "/room", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: cs.currentGame.firestoreId
                })
            });
        }
        else {
            console.error("El id ingresado no existe");
        }
    },
    //Create roomCollection at Firestore
    createRoomAtFirestore: function () {
        var cs = this.getState();
        if (cs.currentGame.rtdbId && cs.currentGame.longrtdbId) {
            return fetch(API_BASE_URL + "/create_room_firestore", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    shortRtdbId: cs.currentGame.rtdbId,
                    longRtdbId: cs.currentGame.longrtdbId
                })
            });
        }
        else {
            console.log("Faltan los Id's");
        }
    },
    //Conect to a room
    conectToRoom: function () {
        var cs = this.getState();
        if (cs.currentGame.longrtdbId) {
            return fetch(API_BASE_URL + '/listen_room', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    longRtdbtID: cs.currentGame.longrtdbId
                })
            });
        }
        else {
            console.log("id no encontrado");
        }
    },
    changeOnlineStatus: function () {
        return fetch(API_BASE_URL + '/change_status', {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            }
        });
    },
    //Verify shortID and return longID
    authenticateRoom: function (shortID) {
        var cs = this.getState();
        return fetch(API_BASE_URL + "/auth_room", {
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
    //Listen to a room at Real Time Data Base
    listenToRoom: function () {
        var cs = this.getState();
        if (cs.currentGame.longrtdbId) {
            return fetch(API_BASE_URL + '/listen_room', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    longRtdbtID: cs.currentGame.longrtdbId
                })
            });
        }
        else {
            console.log("id no encontrado");
        }
    },
    suscribe: function (callback) {
        this.listeners.push(callback);
    },
    //Save score
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
    //Determinates who wins
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
