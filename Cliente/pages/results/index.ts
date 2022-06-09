import { state } from "../../state";
import {Router} from '@vaadin/router';

const resultImages = {
    tie: require("url:../../images/empate. jpg"),
    win: require("url:../../images/win. jpg"),
    loss: require("url:../../images/lose. jpg"),
};

class ResultPage extends HTMLElement {
  connectedCallback(){
    this.render();
    const currentState = state.getState();
    const currentGame = currentState.currentGame;
    const myPlay = currentGame.myPlay;
    const computerPlay = currentGame.computerPlay;
    const whoWins = state.whoWins(myPlay, computerPlay);
  
    let background;
    let imagen;
    if (whoWins === "wins") {
      imagen = resultImages.win; 
      background = "rgba(136, 137, 73, 0.6)";
    } else if (whoWins === "loss") {
      imagen = resultImages.loss;
      background = "rgba(137, 73, 73, 0.6)";
    } else if (whoWins === "tie") {
      imagen = resultImages.tie;
      background = "rgba(106, 112, 101, 0.6)";
    }
  }

  render(){
    let background;
    let imagen;
    const currentState = state.getState();
    const button = require("url:../../images/boton. jpg");
    this.innerHTML = `
      <div>
        <img class="img__result" src="${imagen}">
      </div>
      <div class="board">
        <div>
          <h3 class = score>Score</h3>
        </div>
        <h3 class = you>Vos: ${currentState.history.myScore}</h3>
        <h3 class = machine>Máquina: ${currentState.history.computerScore}</h3>
      </div>
      <div class="img-container">
        <img class = home-button src="${button}">
      </div>
    `;
    
    this.querySelector(".home-button").addEventListener("click", () => {
      Router.go("/game");
    });
    
    
    const style = document.createElement("style");
    style.innerHTML = `
      .container__results {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      justify-content: center;
      padding-top: 40px;
      background-color: ${background};
      }
      .img__result {
      height: 180px;
      }
      .board {
      height: 190px;
      width: 230px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 10px solid #000;
      border-radius: 10px;
      margin: 5px 0;
      background-color: #fff;
      }
      .board {
        margin: 0 auto;
      text-align: center;
      font-size: 40px;
      font-weight: 700;
      height: 100%;
      }
      .board > text-comp {
      align-self: flex-end;
      }
      .back {
      margin-top: 10px;
      }
      .score{
        font-family: "Anton";
        font-size: 50px;
      }
      .you {
        text-align: right;
        font-family: "Padauk";
        font-size: 30px;
      }
      .machine{
        text-align: right;
        font-family: "Padauk";
        font-size: 30px;
      }
      .img-container{
        display: flex;
        justify-content: center;
        margin-top: 200px;
      }
    `;
  
    this.appendChild(style);
  }
}
customElements.define("result-page",ResultPage )