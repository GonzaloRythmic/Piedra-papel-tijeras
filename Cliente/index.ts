
import { state } from "./state";
import './router'
import  "./pages/home/index.ts"
import  "./pages/intructions/index.ts"
import  "./pages/game/index.ts"
import  "./pages/showhands/index.ts"
import  "./pages/results/index.ts"
import  "./pages/loginId/index.ts"
import "./pages/login/index"
import {database} from "../Server/database"
import { getDatabase, ref, onValue } from "firebase/database";

(function () {
  // state.getStorage();
  // const refEl = ref(database, "User")
  // console.log(refEl);
  //   const variable = onValue(refEl, (snapshot)=>{
  //       const data = snapshot.val();
  //       console.log(data);
  //   })
  //   console.log(variable);
})();