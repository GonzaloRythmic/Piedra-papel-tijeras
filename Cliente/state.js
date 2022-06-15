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
var state = {
    data: {
        currentGame: {
            player2_move: "",
            player1_move: "",
            gamer_1_name: "",
            gamer_2_name: "",
            gamer_1_rtdbId: "",
            gamer_2_rtdbId: "",
            gamer_1_firestoreId: "",
            gamer_2_firestoreId: ""
        },
        history: {
            myScore: 0,
            computerScore: 0
        }
    },
    listeners: [],
    getStorage: function () {
        var local = JSON.parse(localStorage.getItem("data"));
        if (localStorage.getItem("data")) {
            return (this.data.history = local);
        }
    },
    getState: function () {
        return this.data;
    },
    setState: function (newState) {
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
    setName: function (name) {
        var currentState = this.getState();
        currentState.currentGame.gamer_1_name = name;
        var newState = currentState;
        this.setState(newState);
    },
    authentication: function (userId) {
        return fetch("/auth", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId
            })
        });
    },
    createUser: function (userName) {
        return fetch(API_BASE_URL + "/signup", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: userName,
                owner: true
            })
        })
            .then(function (data) {
            return data.json();
        })
            .then(function (res) {
            var cs = state.getState();
            var newUserId = res.userId;
            cs.currentGame.gamer_1_firestoreId = newUserId;
            state.setState(cs);
            console.log("Asi quedo yo el State", cs);
        });
    },
    createRoom: function (userName, userId) {
        console.log(userName);
        return fetch(API_BASE_URL + "/room", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                userName: userName
            })
        }).then(function (data) {
            return data.json();
        }).then(function (res) {
            console.log("Hola soy el res", res);
        });
    },
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
