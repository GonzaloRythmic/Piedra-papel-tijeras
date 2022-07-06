import { Router } from "@vaadin/router";
import { state } from "../../state";

class Login extends HTMLElement {
  startButton() {
    document.querySelector(".button-start").addEventListener("click", (e) => {
      e.preventDefault;

      //Get elements
      const gamer_1_name = document.getElementById("input-name") as any;
      const email = document.getElementById("input-email") as any;
      const userName = gamer_1_name.value;
      const userEmail = email.value;

      //If user does not exists
      if (userName === "" && userEmail === "") {
        alert("Debes ingresar un nombre y un email.");
        Router.go("/login");
      } else {
       
        //Set name and email at State
        state.setEmailAndName(userEmail, userName);
        
        // Create user at Firestore
        state.createUserAtFirestore().then((res)=>{
          return res.json();
        }).then((data)=>{

          //Authenticate user
          state.authentication().then((res) => {
            return res.json();
          }).then((data) => {
            const cs = state.getState();
            cs.currentGame.firestoreId = data.id;
            state.setState(cs);

            //Create room at Real Time Data Base
            state.createRoom().then((res) => {
              return res.json();
            }).then((data) => {
              cs.currentGame.rtdbId = data.shortRoomId
              cs.currentGame.longrtdbId = data.longRoomId
              state.setState(cs);
              //Create roomCollection at Firestore
              state.createRoomAtFirestore().then((res)=>{
                return res.json()
              }).then(()=>{
                Router.go("/id_code")
              })
            });
          });;

        })
      }
    });
  }

  connectedCallback() {
    this.render();
    this.startButton();
  }

  render() {
    const rock = require("url:../../images/piedra. jpg");
    const sisors = require("url:../../images/tijera. jpg");
    const paper = require("url:../../images/papel. jpg");
    const button = require("url:../../images/boton. jpg");
    const sala = require("url:../../images/botón (5).png");

    this.innerHTML = `
        <div>
        <div class = home-title-container>
            <h2 class = home-title>Por favor ingresa tu nombre</h2>
        </div>
        <div class = home-button-container>
            <input class="input" type="text" id="input-name">
        </div>

        <div class = home-title-container>
        <h2 class = home-title>Por favor ingresa tu email</h2>
        </div>
        <div class = home-button-container>
        <input class="input" type="text" id="input-email">
        </div>

        <div class="button-container">
            <img class = button-start src="${button}">
        </div>
        <div class = img-containter-container>
            <div class = img-container>
            <div class = img-mini-container>
                <img class = img src="${rock}">
            </div>
            <div class = img-mini-container>
                <img class = img src="${sisors}">
            </div>  
            <div class = img-mini-container>
                <img class = img src="${paper}">
            </div>
        </div>
    `;
    const style = document.createElement("style");

    style.innerHTML = `
      .home-title-container{
        width: 100%;
        height: auto;
        text-align: center;
        display: flex;
        justify-content: center;
      }
      .home-title{
        font-family: "Permanent Marker";
        font-size: 80px;
      }
      .home-button-container{
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        text-align: center; 
      }
      .home-button{
        background-color: black;
      }
      .img-containter-container{
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .img-container{
        margin-top: 35px;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 50px;
      }
      .img-mini-container{
        display: flex;
        justify-content: center;
      }
      @media (min-width: 600px){
        .img-container{
          width: 322px;
          height: 180px
        }
      }
      .img{
        width: 56px;
        height: 128px;
      }
      @media (min-width: 600px){
        .img{
          width: 45px;
          height: 100px
        }
      }
      .button-container{
        display:flex;
        justify-content:center;
        margin-top:25px;
      }
      .input{
          width: 322px;
          height: 87px;
          border-solid: black;
          border-radius: 30px;
      }
    `;
    this.appendChild(style);
  }
}
customElements.define("login-page", Login);
