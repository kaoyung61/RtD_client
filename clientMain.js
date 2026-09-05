console.log("version 05.09_2");

import { connectToServer } from "./clientNetwork.js";

import {
    createStartScreen,
    showLoginScreen
} from "./ui/clientStartScreen.js";

import {
    createGameScreen,
} from "./ui/clientGameScreen.js";

//setTimeout(() => {showLoginScreen();}, 1500);
//setTimeout(() => {showStartScreen();}, 1500);

connectToServer();


//createStartScreen();
//createGameScreen();






