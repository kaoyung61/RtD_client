import {SERVER_HTTP, SERVER_SOCKET} from "./config.js";

let socket;

export async function sendRequest(
    command,
    data={}
){
    const response =
        await fetch(
            SERVER_HTTP,
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },
                body:
                JSON.stringify({
                    command,
                    ...data
                })
            }
        );
    return await response.json();
}


export function connectSocket(){
    socket =
    new WebSocket(SERVER_SOCKET);

    socket.onopen = ()=>{
        console.log("WebSocket connected");
    };

    socket.onmessage = event=>{
        const data = JSON.parse(event.data);
        receiveEvent(data);
    };

    socket.onclose = ()=>{
        console.log("WebSocket closed");
    };

}

function receiveEvent(data){

    console.log("Server event:",data);
    /* позже:
    switch(data.event){
        case "updateMap":
            ...
    }

    */
}


export function sendSocket(data){

    socket.send(JSON.stringify(data));

}