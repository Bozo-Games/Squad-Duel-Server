"use strict";
const E = require('../../client/duel/Helpers/Enums.js');
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
    get socketID() {
        return this._socketID;
    }
    set socketID(val) {
        if(val !== undefined) {
            this.status = E.PlayerStatus.Filled;
        } else {
            this.status = E.PlayerStatus.Open;
        }
        this._socketID = val;
    }
}

module.exports = Player;