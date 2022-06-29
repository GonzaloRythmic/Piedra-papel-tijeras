import {Router} from '@vaadin/router';
import { state } from '../../state';

class LoginId extends HTMLElement {
  listeners(){
    document.querySelector(".sala").addEventListener("click", (e) => {
      e.preventDefault;
      const inputID = document.getElementById("input-id") as any
      const gamer_1_name = document.getElementById("input-name") as any; 
      const email = document.getElementById("input-email") as any;

      const inputIDValue = inputID.value
      const userName = gamer_1_name.value
      const userEmail = email.value


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
            cs.currentGame.gamer_1_firestoreId = data.id;
            state.setState(cs);
            console.log("Línea siguiente comienza state.authenticateRoom()")
            state.authenticateRoom(inputIDValue).then((res)=>{
              return res.json()
            }).then((data)=>{
              console.log(data)
            })
            state.listenDatabase(inputIDValue)
            console.log("Acá termina lógica de /loginId")
          });;
        })
        console.log(state.getState())
      }
    })
  }
  connectedCallback(){
    this.render();
    this.listeners()
  }
  render(){
    const rock = require("url:../../images/piedra. jpg")
    const sisors = require("url:../../images/tijera. jpg")
    const paper = require("url:../../images/papel. jpg")
    const button = require("url:../../images/boton. jpg")
    const sala = require("url:../../images/botón (5).png")
    
    this.innerHTML = `

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

    <div class = home-title-container>
        <h2 class = home-title>Por favor ingresa un ID</h2>
    </div>
    <div class = home-button-container>
        <input class="input" id="input-id" type="text">
    </div>
    <div class="sala-container" >
        <img class = "sala" id='sala'src="${sala}">
    </div>
    `;
  
    
    const style = document.createElement("style");
    style.innerHTML =`
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
        margin-top: 75px;
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
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 50px;
        position: absolute; bottom: 0;
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
      .sala-container{
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
    `
    this.appendChild(style);
  };
}
customElements.define("loginid-page", LoginId);