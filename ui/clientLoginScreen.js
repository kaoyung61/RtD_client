import { sendtoServer } from "../clientNetwork.js";


export function createLoginScreen(){

    const loginScreen = document.getElementById("loginScreen");
    if(!loginScreen){
        console.error("loginScreen not found");
        return;
    }

    loginScreen.innerHTML = `
        <div id="login_text">Please login</div>
        <input type="text" id="login_input" class="login_input" placeholder="Login" required />
        <input type="password" id="password_input" class="login_input" placeholder="Password" required />
        <button type="button" id="login_button" class="button_0">Sign In</button>
        <!--<button type="button" id="openRegister_button" class="button_0">I'm new here. Register me</button>
    `;
    document.getElementById("loginScreen").style.height = "0%";
    document.getElementById("login_button").addEventListener("click", loginBtn_click);
    //document.getElementById("openRegister_button").addEventListener("click", openRegisterBtn_click);

    showLoginScreen()

}

export function showLoginScreen(){
    document.getElementById("logo_img").style.height = "40%";
    document.getElementById("loginScreen").style.height = "50%";
    document.getElementById("lobbyScreen").style.height = "0%";
}


function loginBtn_click(){
    let login = document.getElementById("login_input").value;
    let password = document.getElementById("password_input").value;
    if (!login || !password) return;
    loginOnServer(login, password);
}

function loginOnServer(login, password) {
    let dataToSend = {login: login, password: password };
    sendtoServer("loginOnServer", dataToSend);
}




export function createLobbyScreen(){
    const lobbyScreen = document.getElementById("lobbyScreen");
    if(!lobbyScreen){
        console.error("lobbyScreen not found");
        return;
    }

    lobbyScreen.innerHTML = `
		<div id="GameRooms-table-container">
            <table id="GameRooms-table">
                <thead>
                    <tr>
                        <th>RoomID</th>
                        <th>Name</th>
                        <th>Map</th>
                        <!--<th>Players</th>
                        <!--<th><img src="img/lock.png" alt="Lock" style="width: 20px; height: 20px;" /></th> <!-- Замок вместо заголовка -->
                    </tr>
                </thead>
                <tbody>
                    <!-- Данные таблицы будут добавлены динамически с помощью JavaScript -->
                </tbody>
            </table>
		</div>
		<button id="GameRooms-connectButton" class="button_0">Connect</button>
    `;
    document.getElementById("GameRooms-container").style.height = "0%";
    document.getElementById("GameRooms-connectButton").addEventListener("click", connectButton_click);
}

export function showLobbyScreen(){
    document.getElementById("logo_img").style.height = "40%";
    document.getElementById("loginScreen").style.height = "0%";
    document.getElementById("lobbyScreen").style.height = "50%";
}
/*
function openRegisterBtn_click(){
    let dataToSend = {
        login: document.getElementById("login_input").value,
        password: document.getElementById("password_input").value
    };

    localStorage.setItem("player", JSON.stringify(dataToSend));
    sendtoServer("newClientRegistration", dataToSend);

}
*/

function connectButton_click() {
    const selectedRow = document.querySelector("#GameRooms-table tbody tr.selected");

    if (!selectedRow) {
        console.log("No room selected");
        return;
    }

    const roomID = selectedRow.cells[0].textContent;
    console.log("Selected room:", roomID);
    let dataToSend = {roomID: roomID};
    sendtoServer("connectRoom", dataToSend);
}