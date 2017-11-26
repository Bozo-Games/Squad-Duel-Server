class Player {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.socketID = json.socketID;
        this.name = json.name;
    }
    toJSON() {
        return {
            socketID: this._socketID,
            status: this.status,
            name: this.name
        }
    }
    get isMe() {
        return this.socketID === socket.id;
    }
}