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
        type: "territoryInfo",
        number: document.getElementById("number").value,
        was: document.getElementById("was").value
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

        <input id="number" placeholder="2">
        <ul id="was">
            <li>id</li>
            <li>region</li>
            <li>neighbors</li>
            <li>bandits</li>
            <li>boss</li>
            <li>generals</li>
            <li>border</li>
        </ul>
        <button id="send">Send</button>

        <hr>

        <pre id="log"></pre>
    `;

    document.getElementById("setName").onclick = set_New_Name;
    document.getElementById("send").onclick = send_message;

}