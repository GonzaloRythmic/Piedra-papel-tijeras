import { state } from "../../state";
import {Router} from '@vaadin/router' ;

class GamePage extends HTMLElement {
    connectedCallback() {
        this.render();
        var timeleft = 5;
        var downloadTimer = setInterval(function(){
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                Router.go('/instructions');
            } else {
                document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
            }
            timeleft --;
        }, 1000);

        const imgContainer = this.querySelector(".img-container").children;
    for (const hand of imgContainer) { 
        hand.addEventListener("click", () => {  
            const type = hand.getAttribute("play");

            setTimeout(() => {
                clearInterval(downloadTimer);
                Router.go('/showhands');
            }, 1300);
     
            if (type === "scissors") {
            state.setMove("scissors");
            
            } else if (type === "rock") {
                state.setMove("rock");
               
            } else if (type === "paper") {
                state.setMove("paper");
            }
        
        });
    }
    }

    render(){

        const rock = require("url:../../images/piedra. jpg")
        const sisors = require("url:../../images/tijera. jpg")
        const paper = require("url:../../images/papel. jpg")

        this.innerHTML = `
        <div class = countdown-container>
            <div class = countdown id="countdown"></div>
        </div>

        <div class= img-container>
            <div play = "rock">
                <div class = zoom ><img class = "rock" src="${rock}" /></div>
            </div>
            <div play = "scissors">
                <div class = zoom><img class = "sisors" src="${sisors}" /></div>
            </div>
            <div play = "paper">
                <div class = zoom><img class = "paper" src="${paper}" /></div>
            </div>
        </div>
        <div class = text-container>
            <h3 class = text>Elige rápido!</h3>
        </div>
        `

        const style = document.createElement("style");
        style.innerHTML =`
        .countdown{
            font-family: 'Freckle Face', cursive;
            font-size: 40px;
        }
        .countdown-container{
            margin-top: 25px:
            width: 100%;
            display: flex;
         justify-content: center;
            margin-top: 20px;
        }
        .img-container{
            margin-top: 300px;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
        .zoom {
            padding: 10px;
            transition: transform .2s; /* Animation */
            width: 100%;
            margin: 0 auto;
            display: flex;
            justify-content: center;
        }
        .zoom:hover {
            transform: scale(1.2); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
        }
        .img {
            width: 100px:
            height: 100px;
        }
        .text-container {
            display: flex;
            justify-content: center;
        }
        .text {
            font-size: 50px;
            font-family: "IM Fell English SC"
        }
    `
    this.appendChild(style);}
}
customElements.define("game-page", GamePage);

