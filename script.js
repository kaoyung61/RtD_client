const button = document.getElementById("send");

button.onclick = async () => {

    const value = document.getElementById("value").value;

    const response = await fetch("https://rtd-b8p7.onrender.com/api/query", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            value
        })

    });

    const data = await response.json();

    document.getElementById("answer").innerText = data.result;

};