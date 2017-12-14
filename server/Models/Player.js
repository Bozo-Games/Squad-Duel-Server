"use strict";
const E = require('../Helpers/enums.js');
class Player {
    constructor(json) {
        json = json === undefined ? {} : json;
        this._socketID = json.socketID;
        this.name = json.name;
    }
    toJSON() {
        return {
            socketID: this._socketID,
            name: this.name
        }
    }
    get socketID() {
        return this._socketID;
    }
}
module.exports = Player;