import { sendtoServer } from "./network.js";


export function createStartScreen(){

    
    const loginScreen = document.getElementById("loginScreen");
    if(!loginScreen){
        console.error("loginScreen not found");
        return;
    }

    loginScreen.innerHTML = `
		<div id="loginModal" class="login_modal">
		<div id="login_text">Please login</div>
		<input type="text" id="login_input" class="login_input" placeholder="Login" required />
		<input type="password" id="password_input" class="login_input" placeholder="Password" required />
		<button type="button" id="login_button" class="button_0"">Sign In</button>
		<button type="button" id="openRegister_button" class="button_0" onclick="openRegisterBtn_click()">I'm new hier. Register me</button>
        </div>
    `;
    document.getElementById("loginModal").style.height = "0%";
    document.getElementById("login_button").addEventListener("click", loginBtn_click);
    document.getElementById("openRegister_button").addEventListener("click", openRegisterBtn_click);

    const roomScreen = document.getElementById("roomScreen");
    if(!roomScreen){
        console.error("roomScreen not found");
        return;
    }

    roomScreen.innerHTML = `
		<div id ="GameRooms-container">
		<div id="GameRooms-table-container">
        <table id="GameRooms-table">
            <thead>
                <tr>
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
		<button id="GameRooms-connectButton" class="button_0" onclick="connectButton_click()>Connect</button>
	</div>
    `;
    document.getElementById("GameRooms-container").style.height = "0%";

}

export function showLoginScreen(){

    console.log("showLoginScreen called_32");
    document.getElementById("logo_img").style.height = "40%";

    document.getElementById("loginModal").style.height = "50%";



}

function loginBtn_click(){

    let dataToSend = {
        login: document.getElementById("login_input").value,
        password: document.getElementById("password_input").value
    };

    localStorage.setItem("playerLogin", JSON.stringify(dataToSend));

    sendtoServer("login", dataToSend);
}

function openRegisterBtn_click(){
    let dataToSend = {
        login: document.getElementById("login_input").value,
        password: document.getElementById("password_input").value
    };

    localStorage.setItem("playerLogin", JSON.stringify(dataToSend));
    sendtoServer("newRegister", sendData);

}