import {Router} from '@vaadin/router';
import { Console } from 'console';
import { state } from "../../state";

  class IdCodePage extends HTMLElement { 
    connectedCallback() {
      const cs = state.getState()
      this.render();
      //A partir de esta linea deberia estar escuchando los cambios 
      state.listenToRoom().then((res)=>{
        return res.json()
      }).then((data)=>{
        cs.currentGame.rtdbData = data
        console.log("esto es lo que hay en el state",cs.currentGame.rtdbData)
        //A partir de acá deberia escuchar el primer cambio. Se encuentra esperando que un usuario nuevo ingrese a la sala.
        //Cuando lo haga, automaticamente cambia el flag "onlineGuest" a true, y al detectar ese cambio
        //debería pasar a otra pantalla. 
        if (data.onlineGuest == true) {
          Router.go('/instructions')
        }
      })

    }

  render(){
    const cs = state.getState();
    const namePlayer1 = cs.currentGame.name;
    const idCode = cs.currentGame.rtdbId;


    const rock = require("url:../../images/piedra. jpg")
    const sisors = require("url:../../images/tijera. jpg")
    const paper = require("url:../../images/papel. jpg")
    const button = require("url:../../images/boton. jpg")
    const sala = require("url:../../images/botón (5).png")

    this.innerHTML = `
        <div class="header">
            <div class="score-container">
                <h4>Jugador:${namePlayer1}</h4>
            </div>
            <div class ="sala-container">
              <div>SALA</div>
              <div>${idCode}</div>
            </div> 
        </div>
      <div class = home-title-container>
        <h2 class = home-title>Comparte este código con tu contricante</h2>
      </div>
      <div class="id-code">
        <div>${idCode}</div>
      </div>

      <button class="boton">
        boton
      </button>

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
        font-family: 'Anton', sans-serif;
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
      .id-code{
        font-family: 'Anton', sans-serif;
        font-size: 100px;
        display: flex;
        justify-content: center;
        
      }
    `
    this.appendChild(style);
  }
}
customElements.define("id-code-page", IdCodePage);
