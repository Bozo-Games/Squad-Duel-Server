
"use strict";
class Player {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.socketID = json.socketID;
        this.status = json.status === undefined ? "Open" : json.status;
        this.name = json.name;
    }
    toJSON() {
        return {
            socketID: this.socketID,
            status: this.status,
            name: this.name
        }
    }
}

module.exports = Player;