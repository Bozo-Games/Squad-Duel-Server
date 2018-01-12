class GameView extends Sprite {
	constructor(json) {
		console.log('new game');
		json = json === undefined ? {} : json;
		json.borderWidth = 0;
		super(json);
		this.field = new FieldView({parentSprite:this,w:this.w,h:this.h});
		this.draft = new DraftView({parentSprite:this,w:this.w,h:this.h});
		this.state = json.state === undefined ? 'newGame' : json.state;
		this.draftingCharacter = 1;
		this.playerCharacters = [];
		this.oppCharacters = [];
		this.player = {};
		this.opp = {};
	}

	loadJSON(json) {
		console.log((new Date()).getTime() + ' new JSON');
		super.loadJSON(json);
	}
	animate(json) {
		console.log((new Date()).getTime() + ' JSON animating');
		this.id = json.id;
		this.player = json['player'+network.playerLetter];
		this.opp = json['player'+network.oppLetter];
		this.draftingCharacter = json['characters'+network.playerLetter].length;
		if(this.state === 'newGame') {
			if(json.state !== this.state){
				this.screenTransition(function () {
					this.state = json.state;
					this.loadJSON(json);
				}.bind(this));
			} else if(this.player.socketID !== network.socket.id) {
				network.joinGame();
			}
		} else if(this.state === 'drafting') {
			if(this.draftingCharacter < 3) {
				this.draft.loadJSON(json['draft' + network.playerLetter]);
			} else if(json.state === 'drafting') {
				this.field.loadJSON(json.field);
				this.animateCharacters(json,true);
				this.animateCharacters(json,false);
			} else {
				this.screenTransition(function () {
					this.state = json.state;
					this.loadJSON(json);
				}.bind(this));
			}
		} else if(this.state === 'characterSelect'){
			this.field.loadJSON(json.field);
			this.animateCharacters(json,true);
			this.animateCharacters(json,false);
		}
	}
	animateCharacters(json, isPlayer = true) {
		let key = isPlayer ? 'player' : 'opp';
		for(let c of json['characters'+network[key+'Letter']]) {
			c.isPlayer = isPlayer;
			c.isOpp = !isPlayer;
			let shouldPush = true;
			for(let pc of this[key +'Characters']) {
				if(pc.id === c.id) {
					pc.loadJSON(c);
					shouldPush = false;
					break;
				}
			}
			if(shouldPush) {
				let char = new CharacterView({
					parentSprite: this
				});
				this[key +'Characters'].push(char);
				char.loadJSON(c);
			}
		}
	}
	screenTransition(callBack) {
		this.animation = {
			startFrame: {t:300},
			keyFrames: [
				{w:0,h:0,t:300},
				{w:1,h:1}
			],
			callBack: callBack
		}
	}

	draw() {
		push();
		super.applyTransformations();
		if(this.state === 'newGame') {
			textAlign(CENTER,CENTER);
			let connectedPlayers = 0;
			if(this.player.socketID !== undefined) {
				connectedPlayers++;
			}
			if(this.opp.socketID !== undefined) {
				connectedPlayers++;
			}
			text('Waiting For Players ' + connectedPlayers + '/2',0,0);
		} else if(this.state === 'drafting') {
			if( this.playerCharacters.length < 3) {
				//super.drawSubSprites();
				this.draft.draw();
				textAlign(CENTER, TOP);
				fill('#000');
				text('Drafting Character ' + (this.draftingCharacter + 1) + '/3', 0, -this.h / 2);
			} else {
				this.field.draw();
				for(let cha of this.oppCharacters) {
					cha.draw();
				}
				for(let cha of this.playerCharacters) {
					cha.draw();
				}
				textAlign(CENTER, TOP);
				fill('#000');
				text('Waiting For Opponent To Finish Draft', 0, -this.h / 2);
			}
		} else {
			//super.drawSubSprites();
		}
		pop();
	}

	swapSprite(oldSprite,newSprite) {
		for(let key of ['playerCharacters','oppCharacters']) {
			for(let i =0; i < this[key].length; i++) {
				if(this[key][i].id === oldSprite.id) {
					this.removeSubSprite(this[key][i]);
					this[key][i] = newSprite;
					this.addSubSprite(this[key][i]);
					return;
				}
			}
		}
	}
}
