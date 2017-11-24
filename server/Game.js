
const Player = require('./Player.js');
class Game {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.playerA = json.playerA === undefined ? new Player({status: 'Open'}) : new Player(json.playerA);
        this.playerB = json.playerB === undefined ? new Player({status: 'Open'}) : new Player(json.playerB);
        this.watchers = json.watchers === undefined ? [] : json.watchers; //an array of scocket IDs
        this.currentState = json.currentState === undefined ? 'New Game' : json.currentState;
    }
    toJSON() {
        return {
            playerA: this.playerA === undefined ? undefined : this.playerA.toJSON(),
            playerB: this.playerB === undefined ? undefined : this.playerB.toJSON(),
            watchers: this.watchers,
            currentState: this.currentState
        }
    }
};

module.exports = Game;