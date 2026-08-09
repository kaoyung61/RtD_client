//import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration } from "./gameLogic/serverLoginRequest.js";

export async function client_AntwortFromServer(data) {
    switch (data.type) {
        case "message": {
            console.log("Server message:", data.text);
            break;
        }
        //case "tockenUpdate": {
        //    playerToken = data.token;
        //    localStorage.setItem("playerToken", playerToken);
            
        //}
        
        default:
            console.log("Server unnown event:", data);
    }

}