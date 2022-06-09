"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var database_1 = require("./database");
var firestore_1 = require("firebase/firestore");
var database_2 = require("firebase/database");
var firestore_2 = require("firebase/firestore");
var app = express(); //Inicializamos express en alguna variable.
app.use(express.json());
var port = process.env.PORT || 3001;
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            app.post("/signup", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var email, name, q, querySnapshot, docRef, user_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = req.body.email;
                            name = req.body.name;
                            q = (0, firestore_2.query)((0, firestore_2.collection)(database_1.firestore, "Users"), (0, firestore_2.where)("email", "==", email));
                            return [4 /*yield*/, (0, firestore_2.getDocs)(q)];
                        case 1:
                            querySnapshot = _a.sent();
                            if (!querySnapshot.empty) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_2.collection)(database_1.firestore, "Users"), {
                                    name: name,
                                    email: email
                                })];
                        case 2:
                            docRef = _a.sent();
                            res.json({ message: "salió todo ok" });
                            return [3 /*break*/, 4];
                        case 3:
                            user_id = querySnapshot.docs[0].id;
                            res.json({ id: user_id });
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/auth", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var email, q, querySnapshot, user_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = req.body.email;
                            q = (0, firestore_2.query)((0, firestore_2.collection)(database_1.firestore, "Users"), (0, firestore_2.where)("email", "==", email));
                            return [4 /*yield*/, (0, firestore_2.getDocs)(q)];
                        case 1:
                            querySnapshot = _a.sent();
                            if (querySnapshot.empty) {
                                res.status(404).json({ message: "User not found" });
                            }
                            else {
                                user_id = querySnapshot.docs[0].id;
                                res.json({ id: user_id });
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            app.post("/rooms", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, docRef, docSnap;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = req.body.userId;
                            docRef = (0, firestore_2.doc)(database_1.firestore, "Users", userId);
                            return [4 /*yield*/, (0, firestore_1.getDoc)(docRef)];
                        case 1:
                            docSnap = _a.sent();
                            if (docSnap.exists) {
                                (0, database_2.set)((0, database_2.ref)(database_1.rtdb, 'rooms' + "GeRmmAiDqcS3mLNjuECR"), {
                                    name: "name",
                                    email: "email",
                                    owner: userId
                                });
                                res.json({ message: "Todo salio ok" });
                            }
                            else {
                                res.status(401).json({ message: "ERROR" });
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            //EndPoints
            app.listen(port, function () {
                console.log("Example app listening on port ".concat(port));
            });
            return [2 /*return*/];
        });
    });
})();
