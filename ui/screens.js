export function showLogin(){

    const screen = document.getElementById("loginScreen");
    console.log(document.getElementById("loginScreen"));
    if(!screen){
        console.error("loginScreen not found");
        return;
    }

    screen.innerHTML = `
        <h1>Login</h1>
        <button id="login">
            Login
        </button>
    `;
}