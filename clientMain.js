import { playerToken, playerLogin, playerPassword } from "./clientNetwork.js";


console.log("version 0801_6");



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


