import { SERVER_HTTP, SERVER_SOCKET } from "./config.js";

let socket = null;

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

        // Авторизация после переподключения
        // sendSocket({
        //     type: "login",
        //     token: localStorage.getItem("token")
        // });

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
    switch (data.type) {
        case "message": {
            alert("message");
            const log = document.getElementById("log");
            if (log) {
                log.textContent += `${data.from}: ${data.text}\n`;
            }
            break;
        }
        
        case "terrInfo": {
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
        console.warn("Socket not connected");
        return false;
    }
    socket.send(JSON.stringify(data));
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