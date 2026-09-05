//import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration } from "./gameLogic/serverLoginRequest.js";
import { updateToken, authoriseOnServer, sendtoServer } from "./clientNetwork.js";



export async function client_AntwortFromServer(data) {
    switch (data.command) {
        case "message":     {return     gotMessage(data);}
        case "token":       {return     gotToken(data);}
        case "errAuth":   {return     gotErrorAuth(data);}
        case "auth":        {return     gotAuthorisation(data);}
        case "errLogin":  {return     gotErrorLogin(data);}

        case "errRoomConnection":  {return     gotErrorRoomConnection(data);}
        case "RoomConnection":  {return     gotRoomConnection(data);}
        case "lobby":       {return     gotLobby(data);}
        case "roomState":   {return     gotRoomState(data);}
        case "mapData":     {return     updateGameInterface(data);}
       
        
        default:
            console.log("Server unknown event:", data);
    }

}

export async function gotMessage(data) { console.log("serverMessage:", data); }



export async function gotToken(data) {
    /* Server:
                sendToSocket(socket, { command: "token", token: player.token });
    */
    updateToken(data.token);
    authoriseOnServer();
}


export async function gotErrorLogin(data) {
    /* Server:
                sendToSocket(socket, { command: "errorLogin", type: "login" });     
    */
    messageBox("Login failed. Please check your credentials and try again.");
}


export async function gotErrorAuth(data) {
    /* Server:
                sendToSocket(socket, { command: "errorAuth", text: "Authorisation failed" });
    */
    createLoginScreen();
}


export async function gotAuthorisation(data) {
    /* Server:
                sendToSocket(socket, { command: "auth", success: true });
    */
    /*
    1- check if have aktive room
    1.1 if yes, connect to room
    1.2 if no, ask for room selection
    */
   let activeRoomID = localStorage.getItem("activeRoomID");
   if (activeRoomID) {
        // Connect to the active room
        askConnectToRoom(activeRoomID);
   } else {
        // Ask for room selection
        askLobby();
   }
}

export async function askConnectToRoom(RoomID) {
    sendtoServer("connectRoom", { roomID: RoomID });
}


export async function gotRoomConnection(data) {
    /* Server:
        sendToPlayer(playerID, { command: "RoomConnection", roomID: roomID });
    */ 
    localStorage.setItem("activeRoomID", data.roomID);
    askRoomState(data.roomID);
}

export async function gotErrorRoomConnection(data) {
    /* Server:
                sendToSocket(socket, { command: "errRoomConnection", text: "Player is not allowed to connect to this room" });
    */
    console.log("gotErrorRoomConnection:", data.text);
    askLobby();
}


export async function askLobby() {
    sendtoServer("requestLobby", {text: "requestLobby"});
}







export async function gotLobby(data) {
    /* Server:
                sendToSocket(socket, { command: "rooms", rooms: playerRooms });
    */
  
   document.getElementById("loginModal").style.height = "0%";
   document.getElementById("GameRooms-container").style.height = "50%";


    let selectedRoomID = null;
    let rooms = data.rooms;
    const tableBody = document.querySelector("#GameRooms-table tbody");

    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${room.id}</td>
            <td>${room.name}</td>
            <td>${room.map}</td>
        `;

        row.addEventListener("click", () => {
            document.querySelectorAll("#GameRooms-table tbody tr")
                .forEach(r => r.classList.remove("selected"));

            row.classList.add("selected");
            selectedRoomID = room.id;
        });

        // Первая строка выбрана автоматически
        if (i === 0) {
            row.classList.add("selected");
            selectedRoomID = room.id;
        }

        tableBody.appendChild(row);
    }
        console.log("Server rooms:", data.rooms);
}










async function gotRoomState(roomState) {
    console.log("Server roomState:", roomState);
    // Здесь вы можете обработать состояние комнаты, например, обновить интерфейс игры
    // Например:
    // updateGameInterface(roomState);
    updateGameInterface(roomState);
}


async function updateGameInterface(roomState) {
    // Здесь вы можете обновить интерфейс игры на основе состояния комнаты

}