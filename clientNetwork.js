import { SERVER_HTTP, SERVER_SOCKET } from "./clientConfig.js";
import {client_AntwortFromServer} from "./clientRequestFromServer.js";
import { createLoginScreen } from "./ui/clientLoginScreen.js";


export let playerToken = localStorage.getItem("playerToken");


let socket = null;
let reconnectTimer = null;

export function connectToServer() {
    if (socket &&(socket.readyState === WebSocket.OPEN ||socket.readyState === WebSocket.CONNECTING)) { return; }
    console.log("Connecting...");

    socket = new WebSocket(SERVER_SOCKET);

    socket.onopen = () => {
        console.log("WebSocket connected");
        if (reconnectTimer) { clearInterval(reconnectTimer); reconnectTimer = null; }
        authoriseOnServer();
    };

    socket.onmessage = event => { const data = JSON.parse(event.data); client_AntwortFromServer(data); };

    socket.onclose = () => { console.log("WebSocket disconnected"); startReconnect(); };

    socket.onerror = error => { console.error(error); };
}

function startReconnect() {
    if (reconnectTimer) {return;}
    console.log("Reconnect started");
    reconnectTimer = setInterval(() => { console.log("Reconnect..."); connectToServer();}, 3000);
}


export function updateToken(token) {
    playerToken = token;
    localStorage.setItem("playerToken", token);
    console.log("Token UPD:", token);
}

export function sendtoServer(command, data = {}) {
    if (!socket || socket.readyState !== WebSocket.OPEN) { console.warn("Socket not connected"); return false; }
    socket.send(JSON.stringify({ command, data }));
    return true;
}

function authoriseOnServer() {
    if (!playerToken) {
        console.log("No token found, need to login or register");
        createLoginScreen();
        return;
    }
    sendtoServer("authoriseOnServer", { token: playerToken });
}

export function isConnected() { return socket && socket.readyState === WebSocket.OPEN; }

window.addEventListener("online", () => { console.log("Connection restored"); connectToServer(); });
window.addEventListener("offline", () => { console.log("Connection lost"); });

