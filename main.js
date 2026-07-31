import { connectSocket } from "./network.js";
connectSocket();

import { createStartScreen } from "./ui/client_lobby.js";
createStartScreen();

import { showLoginScreen } from "./ui/client_lobby.js";

setTimeout(() => {
    showLoginScreen();
}, 1500);
