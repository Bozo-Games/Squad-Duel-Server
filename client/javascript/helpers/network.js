let gd;
class Network {
	constructor() {
		this.socket = io();
		console.log(this.socket);
		this.socket.on('debug',this._debug.bind(this));
		this.socket.on('letter assign',this._letterAssign.bind(this));
		this.socket.on('game update',this._gameUpdate.bind(this));
		this.playerLetter = 'A'; //default so things don't break
		this.oppLetter = 'B'; //default so things don't break
	}
	set playerLetter(l) {
		console.log('setting player letter to '+l);
		this._t = l;
	}
	get playerLetter() {
		return this._t;
	}
	_debug(msg) {
		console.log(msg);
	}
	debug(msg) {
		this.socket.emit('debug',msg);
	}
	_letterAssign(letter) {
		console.log('your player letter is ' + letter);
		this.playerLetter = letter;
		console.log('your player letter is ' + this.playerLetter);
		if(letter === 'A') {
			this.oppLetter = 'B';
		} else {
			this.oppLetter = 'A';
		}
	}
	_gameUpdate(json) {
		gd = json;
		if(currentGame !== undefined) {
			if(json.id === currentGame.id || currentGame.id === undefined) {
				currentGame.loadJSON(json);
			} else {
				currentGame = new GameView({x:width/2,y:height/2,w:width,h:height});
				currentGame.loadJSON(json);
			}
		}
	}
	//------------------------------------------------------------------------------------------------------------- POST
	draftArchetype(archetypeID) {
		this.socket.emit('draft archetype',archetypeID)
	}
	draftTitle(titleID) {
		this.socket.emit('draft title',titleID)
	}
	draftAbility(abilityID) {
		this.socket.emit('draft ability',abilityID)
	}
	draftBenchAbility(abilityID) {
		this.socket.emit('draft bench ability',abilityID)
	}
	nextDraft() {
		this.socket.emit('next draft');
	}
}