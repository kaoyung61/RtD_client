//import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration } from "./gameLogic/serverLoginRequest.js";
import { updateToken, authoriseOnServer, sendtoServer } from "./clientNetwork.js";
import { createLoginScreen, createLobbyScreen } from "./ui/clientLoginScreen.js";
import {createGameScreen, updateRoomState, createMap} from "./ui/clientGameScreen.js";


export async function client_AntwortFromServer(input) {
    console.log("[ IN  ]:", input);
    switch (input.command) {
        case "message":     {return     gotMessage(input);}
        case "token":       {return     gotToken(input);}
        case "errAuth":   {return     gotErrorAuth(input);}
        case "auth":        {return     gotAuthorisation(input);}
        case "errLogin":  {return     gotErrorLogin(input);}

        case "errRoomConnection":  {return     gotErrorRoomConnection(input);}
        case "RoomConnection":  {return     gotRoomConnection(input);}
        case "lobby":       {return     gotLobby(input);}
        case "roomState":   {return     gotRoomState(input);}
        case "mapData":     {return     gotMapData(input);}
       
        
        default:
            console.log("Server unknown event:", input);
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
   let activeRoom = JSON.parse(localStorage.getItem("activeRoom"));
   if (activeRoom) {
        // Connect to the active room
        askConnectToRoom(activeRoom.id);
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
    //console.log("gotRoomConnection:", data);
    localStorage.setItem("activeRoom", JSON.stringify(data.room));
    


    //create room interface
    await createGameScreen();

    //ask room state
    //askRoomState(data.room.id); // ask room state from server →😊 maybe in createGameInterface() function

}

export async function gotErrorRoomConnection(data) {
    /* Server:
                sendToSocket(socket, { command: "errRoomConnection", text: "Player is not allowed to connect to this room" });
    */
    //console.log("gotErrorRoomConnection:", data.text);
    askLobby();
}


export async function askLobby() {
    sendtoServer("requestLobby", {text: "requestLobby"});
}







export async function gotLobby(data) {
    /* Server:
                sendToSocket(socket, { command: "rooms", rooms: playerRooms });
    */
  
   createLobbyScreen();


    let selectedRoomID = null;
    let rooms = data.rooms;
    const tableBody = document.querySelector("#lobby_Table tbody");

    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${room.id}</td>
            <td>${room.name}</td>
            <td>${room.map}</td>
        `;

        row.addEventListener("click", () => {
            document.querySelectorAll("#lobby_Table tbody tr")
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
        //console.log("Server rooms:", data.rooms);
}




export async function askRoomState(RoomID) {
    sendtoServer("requestRoomState", { roomID: RoomID });
}





async function gotRoomState(RoomState) {
    //console.log("Server roomState:", RoomID);
    // Здесь вы можете обработать состояние комнаты, например, обновить интерфейс игры
    // Например:
    // updateGameInterface(roomState);
    updateRoomState(RoomState);
}



export async function askMapData(MapName) {
    sendtoServer("requestMapData", { mapName: MapName });
}


async function gotMapData(input) {
    //console.log("Server mapData:", data);
    // Здесь вы можете обработать данные карты, например, обновить интерфейс игры
    // Например:
    // updateGameInterface(mapData);
    console.log("input: ",input);
    localStorage.setItem("MAP_" + input.data.name, JSON.stringify(input.data));
    createMap(input.data);
}