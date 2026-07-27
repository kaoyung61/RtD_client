const SERVER_URL = "https://rtd-b8p7.onrender.com/api/game";

export async function sendRequest(command, data = {}) {
    try {
        const response = await fetch(SERVER_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({command, ...data})
        });

        return processResponse(await response.json());

    } catch (error) {
        return {
            success: false,
            error: "Connection error",
            details: error.message
        };
    }
}

function processResponse(response) {
    if (!response.success)
        console.error("Server error:", response.error);

    return response;
}