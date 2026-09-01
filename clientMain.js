console.log("version 01.09_5");



import {
    connectSocket
} from "./clientNetwork.js";

import {
    createStartScreen,
    showLoginScreen
} from "./ui/clientStartScreen.js";

import {
    createGameScreen,
} from "./ui/clientGameScreen.js";


connectSocket();

createStartScreen();
createGameScreen();

setTimeout(() => {
    showLoginScreen();
}, 1500);




