class Player {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.socketID = json.socketID;
		this.name = json.name;
	}
	get isMe() {
		return this.socketID === socket.id;
	}
	draw() {

	}
}