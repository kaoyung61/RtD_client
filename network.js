import { SERVER_HTTP, SERVER_SOCKET } from "./config.js";

let socket;

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

export function connectSocket() {

    socket = new WebSocket(SERVER_SOCKET);
    socket.onopen = () => {alert("WebSocket connected");};
    socket.onclose = () => {alert("WebSocket closed");};

    socket.onerror = error => {
        alert("WebSocket error");
        console.error(error);
    };

    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        receiveEvent(data);
    };
}

function receiveEvent(data) {
    switch (data.type) {
        case "message": {
            alert("message");
            const log = document.getElementById("log");
            if (log) {
                log.textContent += `${data.from}: ${data.text}\n`;
            }
            break;
        }
        default:
            console.log("Server event:", data);
    }
}

export function sendSocket(data) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert("Socket is not connected");
        return;
    }
    socket.send(JSON.stringify(data));
}