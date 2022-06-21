import {Router} from '@vaadin/router';
import { Console } from 'console';
import { state } from "../../state";

  class IdCodePage extends HTMLElement { 
    
    addListeners(){

    }
    
    connectedCallback() {
      this.render();
      // const cs = state.getState();
      // const userName = cs.currentGame.gamer_1_name;
      // const userId = cs.currentGame.gamer_1_firestoreId;
  
      // const createRoomConst = state.createRoom(userId, userName);
      // console.log(createRoomConst);
  
      // state.createRoom(userId, userName).then((res)=>{
        //   console.log(res.currentGame.gamer_1_rtdbId);
        // }).then((data)=>{});
        // console.log(cs)
    }

  render(){
    // const cs = state.getState();
    // const namePlayer1 = cs.currentGame.gamer_1_name;
    // const idCode = cs.currentGame.gamer_1_rtdbId;
    // console.log(cs.currentGame)
    // console.log(cs.currentGame.gamer_1_firestoreId);


    const rock = require("url:../../images/piedra. jpg")
    const sisors = require("url:../../images/tijera. jpg")
    const paper = require("url:../../images/papel. jpg")
    const button = require("url:../../images/boton. jpg")
    const sala = require("url:../../images/botón (5).png")

    this.innerHTML = `
        <div class="header">
            <div class="score-container">
                <h4></h4>
            </div>
            <div class ="sala-container">
              <div>SALA</div>
              <div></div>
            </div> 
        </div>
      <div class = home-title-container>
        <h2 class = home-title>Comparte este código con tu contricante</h2>
      </div>

      <div class ="idcode-container"></div>
      
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
      .header{
        display:flex;
        justify-content:space-between;
      }
      .idcode-container{
        width: 250px;
        height: 150px;
      }
    `
    this.appendChild(style);
  }
}
customElements.define("id-code-page", IdCodePage);
