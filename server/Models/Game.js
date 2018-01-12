//const ServerFSM = require('../StateMachines/ServerFSM.js');
const Field = require('./Field.js');
const Player = require('./Player.js');
const Generator = require('../Data/Generator.js');
const Character = require('./Character/Character.js');
const Draft = require('./Draft.js');
class Game {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.field = new Field(json.field);
		this.playerA = new Player(json.playerA);
		this.playerB = new Player(json.playerB);
		this.state = 'newGame';
		this.id = Generator.guid();
		this.charactersA = [];
		this.charactersB = [];
		//ServerFSM.initialize(this);
	}
	get json() {
		return  {
			id:this.id,
			playerA:this.playerA.json,
			playerB:this.playerB.json,
			field: this.field.json,
			state:this.state,
			draftA:this.draftA === undefined ? undefined : this.draftA.json,
			draftB:this.draftB === undefined ? undefined : this.draftB.json,
			charactersA:this.charactersA.toBozoJSON(),
			charactersB:this.charactersB.toBozoJSON()
		}
	}
	// ------------------------------------------------------------------------------------------------------- Drafting
	// ------------------------------------------------------------------------------------------------------- Drafting
	enterDraftMode() {
		this.state = 'drafting';
		console.log('Game is entering Draft Mode ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		this.draftA = new Draft();
		this.draftB = new Draft();
	}
	playerDraftsArchetype(socketID,ArchetypeID) {
		let key = this.playerA.socketID === socketID ? 'A' : this.playerB.socketID === socketID ? 'B' : undefined;
		console.log('-------------------------------------------------- '+ArchetypeID+ ' is selected by '+key);
		if(key !== undefined) {
			this['draft'+key].selectOption(ArchetypeID);
		}
		this.updatePlayers();
	}
	playerDraftsTitle(socketID,TitleID) {
		let key = this.playerA.socketID === socketID ? 'A' : this.playerB.socketID === socketID ? 'B' : undefined;
		if(key !== undefined) {
			this['draft'+key].selectOption(TitleID);
		}
		this.updatePlayers();
	}
	playerDraftsAbility(socketID,AbilityID) {
		let key = this.playerA.socketID === socketID ? 'A' : this.playerB.socketID === socketID ? 'B' : undefined;
		if(key !== undefined) {
			this['draft'+key].selectOption(AbilityID);
		}
		this.updatePlayers();
	}
	playerDraftsBenchAbility(socketID,BenchAbilityID) {
		let key = this.playerA.socketID === socketID ? 'A' : this.playerB.socketID === socketID ? 'B' : undefined;
		if(key !== undefined) {
			this['draft'+key].selectOption(BenchAbilityID);
		}
		this.updatePlayers();
	}
	playerRequestsNextDraft(socketID) {
		let key = this.playerA.socketID === socketID ? 'A' : this.playerB.socketID === socketID ? 'B' : undefined;
		if(key !== undefined) {
			let abilitiesJSON = [];
			for(let a of this['draft'+key].abilites) {
				abilitiesJSON.push(a.json);
			}
			this['characters'+key].push(new Character({
				archetype:this['draft'+key].archetype.json,
				title:this['draft'+key].title.json,
				abilities: abilitiesJSON,
				benchAbility: this['draft'+key].benchAbility.json
			}));
			console.log(key + ' is requesting new Draft ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
			this['draft'+key] = new Draft();
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
		console.log('--------------------------------------------------------------------------------updating players');
		if(this.playerA.isFilled) {
			console.log(JSON.stringify(this.json,null,'\t'));
			this.io.sockets.connected[this.playerA.socketID].emit('game update',this.json);
		}
		if(this.playerB.isFilled) {
			this.io.sockets.connected[this.playerB.socketID].emit('game update',this.json);
		}
	}


}
module.exports = Game;
