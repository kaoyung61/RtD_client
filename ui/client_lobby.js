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
		<button type="button" id="login_button" class="button_0" onclick="window.loginBtn_click()">Sign In</button>
		<button type="button" id="openRegister_button" class="button_0" onclick="window.openRegisterBtn_click()">I'm new hier. Register me</button>
  </div>
    `;

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
		<button id="GameRooms-connectButton" class="button_0">Connect</button>
	</div>
    `;


}

export function showLoginScreen(){

document.getElementById("logo_img").style.height = "50%";


}