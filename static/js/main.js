const socket = new WebSocket("ws://localhost:8001/");

function waitForOpenSocket(socket) {
    return new Promise((resolve, _reject) => {
        while (socket.readyState !== socket.OPEN) { /* no-op */ }
        return resolve()
    })
}

socket.addEventListener("message", ({ data }) => handleMessage(data))

async function sendMessage(socket, msg) {
    await waitForOpenSocket(socket)
    socket.send(msg)
}

function handleMessage(msg) {
    const message = JSON.parse(msg)
    switch (message.type) {
        case "player_assignment":
            currentPlayer = message.message
            document.getElementById("current-turn").innerText = "Please select your starting positions. You are player " + currentPlayer
            break;
        case "player_move":
            alert("");
            // makeMove()
            break;
        default:
            alert("");
    }
}