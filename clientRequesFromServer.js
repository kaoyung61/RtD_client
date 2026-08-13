//import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration } from "./gameLogic/serverLoginRequest.js";

export async function client_AntwortFromServer(data) {
    switch (data.command) {
        case "message":     {return     getMessage(data);}
        case "token":       {return     getToken(data);}
        case "rooms":       {return     getRooms(data);}
        //case "tockenUpdate": {
        //    playerToken = data.token;
        //    localStorage.setItem("playerToken", playerToken);
            
        //}
        
        default:
            console.log("Server unnown event:", data);
    }

}

export async function getMessage(data) {
    console.log("Server message:", data.text);
}

export async function getToken(data) {
    /* Server:
                sendToSocket(socket, { command: "token", token: player.token });
    */

    localStorage.setItem("token", data.token);
    console.log("Token UPD:", data.token);
}

export async function getRooms(data) {
    /* Server:
                sendToSocket(socket, { command: "rooms", rooms: playerRooms });
    */
   document.getElementById("loginModal").style.height = "0%";
   document.getElementById("GameRooms-container").style.height = "50%";


    const tableBody = document.querySelector("#GameRooms-table tbody");

    for (const room of data.rooms) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${room.id}</td>
            <td>${room.name}</td>
            <td>${room.map}</td>
        `;
        row.addEventListener("click", () => {
            console.log("Selected room:", room);
        });
        tableBody.appendChild(row);
    }


        console.log("Server rooms:", data.rooms);
}