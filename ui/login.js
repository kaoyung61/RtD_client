export function showLoginScreen(){

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
}