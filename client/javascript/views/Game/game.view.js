class GameView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.borderWidth = 0;
		super(json);
		this.field = new FieldView({parentSprite:this,w:this.w,h:this.h});
		this.draft = new DraftView({parentSprite:this,w:this.w,h:this.h});
		this.state = json.sate === undefined ? 'newGame' : json.state;

		this.player = {};
		this.opp = {};
	}

	loadJSON(json) {
		super.loadJSON(json);
	}
	animate(json) {
		this.player = json['player'+network.playerLetter];
		this.opp = json['player'+network.oppLetter];
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
		} if(this.state === 'drafting') {
			this.draft.loadJSON(json['draft'+network.playerLetter]);
		} else  {
			//this.field.loadJSON(json.field);
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
		} else {
			super.drawSubSprites();
		}
		pop();
	}
}
