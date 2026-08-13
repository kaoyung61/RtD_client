import { SERVER_HTTP, SERVER_SOCKET } from "./clientConfig.js";
import{client_AntwortFromServer} from "./clientRequesFromServer.js";


export let playerToken = localStorage.getItem("playerToken");
export let playerLogin = localStorage.getItem("player") ? JSON.parse(localStorage.getItem("player")).login : null;
export let playerPassword = localStorage.getItem("player") ? JSON.parse(localStorage.getItem("player")).password : null;


let socket = null;

/*
export async function sendRequest(command, data = {}) {
    const response = await fetch(SERVER_HTTP, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            command,
            ...data
        })
    });
    return await response.json();
}
*/


let reconnectTimer = null;

export function connectSocket() {
    if (socket &&(socket.readyState === WebSocket.OPEN ||socket.readyState === WebSocket.CONNECTING)) {
        return;
    }

    console.log("Connecting...");
    socket = new WebSocket(SERVER_SOCKET);
    socket.onopen = () => {
        console.log("WebSocket connected");
        if (reconnectTimer) {
            clearInterval(reconnectTimer);
            reconnectTimer = null;
        }

        //sendtoServer("authoriseMe", { login: playerLogin, password: playerPassword});

    };

    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        receiveEvent(data);
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        startReconnect();
    };

    socket.onerror = error => {
        console.error(error);
    };

}

function startReconnect() {
    if (reconnectTimer) {
        return;
    }
    console.log("Reconnect started");
    reconnectTimer = setInterval(() => {
        console.log("Reconnect...");
        connectSocket();
    }, 3000);
}




function receiveEvent(data) {
    client_AntwortFromServer(data);
    
}


export function updateToken(token) {
    playerToken = token;
    localStorage.setItem("playerToken", token);
}

export function sendtoServer(command, data = {}) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not connected");
        return false;
    }

    socket.send(JSON.stringify({
        token: playerToken,
        command,
        data
    }));

    return true;
}


export function isConnected() {
    return socket && socket.readyState === WebSocket.OPEN;
}

window.addEventListener("online", () => {
    console.log("Connection restored");
    connectSocket();
});

window.addEventListener("offline", () => {
    console.log("Connection lost");
});

