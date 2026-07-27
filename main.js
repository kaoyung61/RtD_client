import { connectSocket } from "./network.js";
import { showLogin } from "./ui/screens.js";

connectSocket();

showLogin();