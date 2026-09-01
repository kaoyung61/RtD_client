//import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration } from "./gameLogic/serverLoginRequest.js";
import { updateToken, sendtoServer } from "./clientNetwork.js";

export async function client_AntwortFromServer(data) {
    switch (data.command) {
        case "message":     {return     gotMessage(data);}
        case "token":       {return     gotToken(data);}
        case "rooms":       {return     gotRooms(data);}
        case "roomState":   {return     gotRoomState(data.data);}
        case "requestToken":  {return   registerOnServer();}
        //case "tockenUpdate": {
        //    playerToken = data.token;
        //    localStorage.setItem("playerToken", playerToken);
            
        //}
        
        default:
            console.log("Server unnown event:", data);
    }

}

export async function gotMessage(data) {
    console.log("Server message:", data.text);
}

export async function gotToken(data) {
    /* Server:
                sendToSocket(socket, { command: "token", token: player.token });
    */
    updateToken(data.token);
    console.log("Token UPD:", data.token);
}

export async function gotRooms(data) {
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
}

async function registerOnServer() {
    let playerToken = localStorage.getItem("playerToken");
    if (!playerToken) {
        console.log("No player token found in localStorage.");
        return;
    }
    sendtoServer("registerPlayer", {token: playerToken });
    console.log("Registering player with token:", playerToken);
}