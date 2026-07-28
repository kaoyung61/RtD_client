import { sendSocket } from "../network.js";

export function startTest() {
    createHTMLtest();
}

function set_New_Name() {
    console.log("set_New_Name");
    sendSocket({
        type: "setName",
        name: document.getElementById("name").value
    });
}

function send_message() {

    console.log("send_message");
    sendSocket({
        type: "message",
        to: document.getElementById("to").value,
        text: document.getElementById("text").value
    });
}

export function createHTMLtest() {
    const screen = document.getElementById("testScreen");
    if (!screen) {
        console.error("testScreen not found");
        return;
    }
    screen.innerHTML = `
        <h2>Player</h2>

        <input id="name" placeholder="Your name">
        <button id="setName">Update name</button>

        <br><br>

        <input id="to" placeholder="Send to">
        <input id="text" placeholder="Message">
        <button id="send">Send</button>

        <hr>

        <pre id="log"></pre>
    `;

    document.getElementById("setName").onclick = set_New_Name;
    document.getElementById("send").onclick = send_message;

}