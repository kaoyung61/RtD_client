import { connectSocket } from "./network.js";
import { showLogin } from "./ui/screens.js";

console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", ()=>{
    showLogin();
});


connectSocket();

showLogin();