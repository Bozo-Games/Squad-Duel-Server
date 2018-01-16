//const ServerFSM = require('../StateMachines/ServerFSM.js');
const fs = require('fs');
const Field = require('./Field.js');
const Player = require('./Player.js');
const Generator = require('../Data/Generator.js');
const Character = require('./Character/Character.js');
const Draft = require('./Draft.js');


const path = './Logs/';
const version = '0.0.0';
const gameName = 'bob';//this will be the file loaded
class Game {
	constructor(json) {
		json = json === undefined ? {} : json;

		this.playerA = new Player();
		this.playerB = new Player();
		this.id = 'new';

		this.charactersA = [];
		this.charactersB = [];
		this.checkVersion(function () {
			this.checkName(function (json) {
				console.log('now loading');
				console.log(JSON.stringify(json,null,'\t'));
				this.playerA = new Player();
				this.playerB = new Player(); //players need to re join and need to be allowed to things words hard ...
				this.field = new Field(json.field);
				this.draftA = new Draft(json.draftA);
				this.draftB = new Draft(json.draftB);
				this.state = json.state;
				this.id = json.id;
				this.charactersA = [];
				this.charactersB = [];
			}.bind(this));
		}.bind(this));
		//ServerFSM.initialize(this);
	}
	get json() {
		let hasPlayers = false;
		hasPlayers = !(this.playerA === undefined || this.playerB === undefined);
		if(hasPlayers) {hasPlayers = this.playerA.isFilled && this.playerB.isFilled;}
		if(hasPlayers) {
			return  {
				id:this.id,
				playerA:this.playerA === undefined ? {}: this.playerA.json,
				playerB:this.playerB === undefined ? {}: this.playerB.json,
				field:this.field === undefined ? {}: this.field.json,
				state:this.state,
				draftA:this.draftA === undefined ? undefined : this.draftA.json,
				draftB:this.draftB === undefined ? undefined : this.draftB.json,
				charactersA:this.charactersA.toBozoJSON(),
				charactersB:this.charactersB.toBozoJSON()
			}
		} else {
			return  {
				id:this.id,
				playerA:this.playerA === undefined ? {}: this.playerA.json,
				playerB:this.playerB === undefined ? {}: this.playerB.json,
				field:this.field === undefined ? {}: this.field.json,
				state:'newGame',
				draftA:this.draftA === undefined ? undefined : this.draftA.json,
				draftB:this.draftB === undefined ? undefined : this.draftB.json,
				charactersA:this.charactersA.toBozoJSON(),
				charactersB:this.charactersB.toBozoJSON()
			}
		}

	}
	// ------------------------------------------------------------------------------------------------- Logging
	checkVersion(callBack) {
		if(fs.existsSync(path+version)) {
			console.log('version ' + version +' exists checking for existing game named ' + gameName);
			callBack();
		} else {
			console.log('version ' + version + ' is missing creating new version and game');
			fs.mkdirSync(path + version,function(err) {
				if (err) {
					return console.error(err);
				}
				callBack();
			});
		}
	}
	checkName(callBack) {
		if(fs.existsSync(path+version+'/'+gameName+'.json')) {
			console.log(gameName + ' loading');
			fs.readFile(path+version+'/'+gameName+'.json', 'utf8', function(err, data) {
				if (err) throw err;
				callBack(JSON.parse(data));
			});
		} else {
			console.log(gameName + ' is a new game');
			callBack({
				field: (new Field({})).json,
				state: 'newGame',
				id: Generator.guid(),
				charactersA: [],
				charactersB: [],
				gameHistory: [],
			});
		}
	}
	saveJSON(json) {
		fs.writeFile(path+version+'/'+gameName+'.json', JSON.stringify(json), function(err) {
			if(err) {
				return console.log(err);
			}
			console.log("The file was saved!");
		});
	}
	// ------------------------------------------------------------------------------------------------ Character Select
	enterCharacterSelect() {
		this.state = 'characterSelect';
	}
	// ------------------------------------------------------------------------------------------------------- Drafting
	enterDraftMode() {
		this.state = 'drafting';
		this.draftA = new Draft();
		this.draftB = new Draft();
	}
	playerDraftsArchetype(socketID,ArchetypeID) {
		let key = this.playerA.socketID === socketID ? 'A' : this.playerB.socketID === socketID ? 'B' : undefined;
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
			if(this['characters'+key].length < 3) {
				this['draft'+key] = new Draft();
			} else {
				this.enterCharacterSelect();
			}
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
			if(this.state === 'newGame') {
				this.enterDraftMode();
			}
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
		let json = this.json;
		if(this.playerA.isFilled) {
			console.log(JSON.stringify(json,null,'\t'));
			this.io.sockets.connected[this.playerA.socketID].emit('game update',json);
		}
		if(this.playerB.isFilled) {
			this.io.sockets.connected[this.playerB.socketID].emit('game update',json);
		}
		this.saveJSON(json);
	}


}
module.exports = Game;
