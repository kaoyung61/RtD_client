let playerToken = null;
let playerLogin = null;
let playerPassword = null;



import { connectSocket } from "./network.js";
connectSocket();

import { createStartScreen } from "./ui/client_lobby.js";
createStartScreen();

import { showLoginScreen } from "./ui/client_lobby.js";

setTimeout(() => {
    showLoginScreen();
}, 1500);
