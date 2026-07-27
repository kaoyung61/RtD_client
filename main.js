import { showLogin } from "./ui/screens.js";
import { connectSocket } from "./network.js";

console.log(document.getElementById("loginScreen"));

connectSocket();

showLogin();