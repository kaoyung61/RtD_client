export function showLogin(){
    console.log( document.getElementById("loginScreen"));
    console.log("showLogin called");
    document.getElementById("loginScreen").innerHTML = `
        <h1>Login</h1>
        <button id="login">
            Login
        </button>
    `;

}



export function showGame(){

    document.getElementById("app").innerHTML = `
        <h1>GameLO</h1>
    `;

}