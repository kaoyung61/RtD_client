export let playerToken = null;
export let playerLogin = null;
export let playerPassword = null;


console.log("version 23");



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


