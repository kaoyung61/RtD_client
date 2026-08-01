export let playerToken = localStorage.getItem("playerToken");;
export let playerLogin = localStorage.getItem("playerLogin");;
export let playerPassword = localStorage.getItem("playerPassword");;


console.log("version 24");



import {
    connectSocket
} from "./clientNetwork.js";

import {
    createStartScreen,
    showLoginScreen
} from "./ui/clientStartScreen.js";


connectSocket();



createStartScreen();


setTimeout(() => {
    showLoginScreen();
}, 1500);


