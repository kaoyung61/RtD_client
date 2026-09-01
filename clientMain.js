import { playerToken, playerLogin, playerPassword } from "./clientNetwork.js";


console.log("version 01.09_2");



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


