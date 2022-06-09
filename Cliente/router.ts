import {Router} from '@vaadin/router';

const rootEl = document.querySelector('.root');
const router = new Router(rootEl);
router.setRoutes([
  {path: "/welcome", component: "home-page"},
  {path: "/instructions", component: "instruction-page"},
  {path: "/game", component: "game-page"},
  {path: "/showhands", component: "showhands-page"},
  {path:"/results", component: "result-page"},
  {path:"/loginId", component: "loginId-page"},
  {path:"/login", component : "login-page"}
]);