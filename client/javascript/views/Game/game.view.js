class GameView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.borderWidth = 0;
		super(json);
		this.field = new FieldView({parentSprite:this,w:this.w,h:this.h});
		this.draft = new DraftView({parentSprite:this,w:this.w,h:this.h});
		this.state = json.state === undefined ? 'newGame' : json.state;
		this.playerCharacters = [];
		this.player = {};
		this.opp = {};
	}

	loadJSON(json) {
		console.log('load called');
		super.loadJSON(json);
	}
	animate(json) {
		this.id = json.id;
		this.player = json['player'+network.playerLetter];
		this.opp = json['player'+network.oppLetter];
		console.log(JSON.stringify(json));
		json.playerCharacters = json.playerCharacters === undefined ? [] : json.playerCharacters;
		if(this.state === 'newGame' && json.state !== this.state) {
			this.animation = {
				startFrame: {t:300},
				keyFrames: [
					{w:0,h:0,t:300},
					{w:1,h:1}
				],
				callBack: function () {
					this.state = json.state;
					this.loadJSON(json);
				}.bind(this)
			}
		} else if(this.state === 'drafting' && json['characters'+network.playerLetter].length < 3) {
			this.draft.loadJSON(json['draft'+network.playerLetter]);
		} else {
			this.field.loadJSON(json.field);
			this.animateCharacters(json,'player');
		}
	}

	animateCharacters(json, isPlayer = true) {
		let key = isPlayer ? 'player' : 'opp';
		for(let c of json['characters'+network[key+'Letter']]) {
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
		} else if(this.state === 'drafting' && this.playerCharacters.length < 3) {
			//super.drawSubSprites();
			this.draft.draw();
			textAlign(CENTER,TOP);
			fill('#000');
			text('Drafting Character '+(this.playerCharacters.length+1) + '/3',0,-this.h/2);
		} else {
			this.field.draw();
			//super.drawSubSprites();
		}
		pop();
	}
}
