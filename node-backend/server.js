const http = require("http");
const WebSocket = require("socket.io");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");

const PORT = 4000;
const JSON_FILE_PATH = path.join(__dirname, "prizes.json");

const server = http.createServer();
const io = WebSocket(server);

function broadcast(data) {
	io.emit("update", data); // Use 'update' event for broadcasting
}

function readAndBroadcast() {
	fs.readFile(JSON_FILE_PATH, "utf8", (err, data) => {
		if (err) {
			console.error("Error reading JSON file:", err);
			return;
		}
		try {
			const jsonData = JSON.parse(data);
			broadcast(jsonData);
		} catch (e) {
			console.error("Error parsing JSON data:", e);
		}
	});
}

const watcher = chokidar.watch(JSON_FILE_PATH, {
	persistent: true,
	ignoreInitial: true,
});
watcher.on("change", readAndBroadcast);

io.on("connection", (socket) => {
	console.log("New client connected");

	// Send current data to the new client
	readAndBroadcast();

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});

	socket.on("error", (error) => {
		console.error("Socket error:", error);
	});
});

server.listen(PORT, () => {
	console.log(`Socket.io server is running on http://localhost:${PORT}`);
});
