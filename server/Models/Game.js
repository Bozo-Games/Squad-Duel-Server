//const ServerFSM = require('../StateMachines/ServerFSM.js');
const Field = require('./Field.js');
const Player = require('./Player.js');
const Generator = require('../Data/Generator.js');
const Draft = require('./Draft.js');
class Game {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.field = new Field(json.field);
		this.playerA = new Player(json.playerA);
		this.playerB = new Player(json.playerB);
		this.state = 'newGame';
		//ServerFSM.initialize(this);
	}
	get json() {
		return  {
			playerA:this.playerA.json,
			playerB:this.playerB.json,
			field: this.field.json,
			state:this.state,
			draftA:this.draftA === undefined ? undefined : this.draftA.json,
			draftB:this.draftB === undefined ? undefined : this.draftB.json,
		}
	}
	// ------------------------------------------------------------------------------------------------------- Drafting
	enterDraftMode() {
		this.state = 'drafting';
		this.draftA = new Draft();
		this.draftB = new Draft();
	}
	playerDraftsArchetype(socketID,ArchetypeID) {
		if(this.playerA.socketID == socketID) {
			this.draftA.selectOption(ArchetypeID);
		}else if(this.playerB.socketID == socketID) {

		}
		this.updatePlayers();
	}
	// ----------------------------------------------------------------------------------------------- Player Management
	newPlayer(socket) {
		if(!this.playerA.isFilled) {
			this.playerA = new Player({letter:'A',socketID:socket.id});
			this.io.sockets.connected[this.playerA.socketID].emit('letter assign','A');
		} else if(!this.playerB.isFilled) {
			this.playerB = new Player({letter:'B',socketID:socket.id});
			this.io.sockets.connected[this.playerB.socketID].emit('letter assign','B');
		}
		if(this.playerA.isFilled && this.playerB.isFilled) {
			this.enterDraftMode();
		}
		this.updatePlayers();
	}
	playerLeave(socket) {
		if(this.playerA.socketID === socket.id) {
			this.playerA = new Player({letter:'A'});
		}
		if(this.playerB.socketID === socket.id) {
			this.playerB = new Player({letter:'B'});
		}
	}
	updatePlayers() {
		console.log('updating players');
		if(this.playerA.isFilled) {
			this.io.sockets.connected[this.playerA.socketID].emit('game update',this.json);
		}
		if(this.playerB.isFilled) {
			this.io.sockets.connected[this.playerB.socketID].emit('game update',this.json);
		}
	}


}
module.exports = Game;
