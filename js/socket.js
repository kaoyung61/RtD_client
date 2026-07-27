const socket = new WebSocket(
    "wss://rtd-b8p7.onrender.com"
);

socket.onopen = () => {
    console.log("WebSocket connected");
};

socket.onmessage = event => {

    const data = JSON.parse(event.data);

    handleServerMessage(data);
};

socket.onerror = error => {
    console.error("WebSocket error", error);
};

socket.onclose = () => {
    console.log("WebSocket closed");
};


function handleServerMessage(data) {

    switch(data.event) {

        case "gameUpdate":
            console.log("Update:", data);
            break;

        case "playerJoined":
            console.log("Player joined:", data);
            break;

        default:
            console.log("Unknown event:", data);
    }
}