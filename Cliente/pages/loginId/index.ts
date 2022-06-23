import {Router} from '@vaadin/router';

class LoginId extends HTMLElement {
  connectedCallback(){
    this.render();
  }
  render(){
    const rock = require("url:../../images/piedra. jpg")
    const sisors = require("url:../../images/tijera. jpg")
    const paper = require("url:../../images/papel. jpg")
    const button = require("url:../../images/boton. jpg")
    const sala = require("url:../../images/botón (5).png")
    
    this.innerHTML = `
    <div class = home-title-container>
        <h2 class = home-title>Por favor ingresa un ID</h2>
    </div>
    <div class = home-button-container>
        <input class="input" type="text">
    </div>
    <div class="sala-container">
        <img class = sala src="${sala}">
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
    </div>`;
  
    
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