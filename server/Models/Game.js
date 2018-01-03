//const ServerFSM = require('../StateMachines/ServerFSM.js');
const Field = require('./Field.js');
const Player = require('./Player.js');
class Game {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.field = new Field(json.field);
		this.playerA = new Player(json.playerA);
		this.playerB = new Player(json.playerB);

		//ServerFSM.initialize(this);
	}
	get json() {
		return  {
			playerA:this.playerA.json,
			playerB:this.playerB.json,
			field: this.field.json
		}
	}
	newPlayer(socket) {
		console.log('New Player ' + socket.id);
		if(!this.playerA.isFilled) {
			console.log('filling player A');
			this.playerA = new Player({letter:'A',socketID:socket.id});
			this.io.sockets.connected[this.playerA.socketID].emit('debug','hello player A');
		} else if(!this.playerB.isFilled) {
			console.log('filling player B');
			this.playerB = new Player({letter:'B',socketID:socket.id});
			this.io.sockets.connected[this.playerB.socketID].emit('debug','hello player B');
		}
	}
	playerLeave(socket) {
		if(this.playerA.socketID === socket.id) {
			console.log('good by player A');
			this.playerA = new Player({letter:'A'});
		}
		if(this.playerB.socketID === socket.id) {
			console.log('good by player B');
			this.playerB = new Player({letter:'B'});
		}
	}

}
module.exports = Game;

/*
//TODO put this in somewhere
let updateClients = serverFSM.on("updateClients", function () {
	io.sockets.emit('debug','test');
});
 */