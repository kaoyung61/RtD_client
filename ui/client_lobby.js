export function createLoginScreen(){

    const logoScreen = document.getElementById("logoScreen");
    if(!logoScreen){
        console.error("logoScreen not found");
        return;
    }

    logoScreen.innerHTML = `
		<img id="logo_img" src="img/logo.png" alt="Логотип">
    `;
    document.getElementById("loginScreen").style.height = "50%";


    const loginScreen = document.getElementById("loginScreen");
    if(!loginScreen){
        console.error("loginScreen not found");
        return;
    }

    loginScreen.innerHTML = `
		<div id="login_text">Please login</div>
		<input type="text" id="login_input" class="login_input" placeholder="Login" required />
		<input type="password" id="password_input" class="login_input" placeholder="Password" required />
		<button type="button" id="login_button" class="button_0" onclick="window.loginBtn_click()">Sign In</button>
		<button type="button" id="openRegister_button" class="button_0" onclick="window.openRegisterBtn_click()">I'm new hier. Register me</button>
    `;

    const roomScreen = document.getElementById("roomScreen");
    if(!roomScreen){
        console.error("roomScreen not found");
        return;
    }

    roomScreen.innerHTML = `
		<div id="room_text">Please select a room</div>
		<button type="button" id="create_room_button" class="button_0" onclick="window.createRoomBtn_click()">Create Room</button>
		<button type="button" id="join_room_button" class="button_0" onclick="window.joinRoomBtn_click()">Join Room</button>
    `;


}