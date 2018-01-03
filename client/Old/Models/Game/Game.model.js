class Game extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super({
			x:0,
			y:0,
			w:width,
			h:height,
			fillColor:colors.game.background
		});
		this.currentState = 'newGame';
		this._iAmPrimaryPlayer = false;
		this.playerLetter = 'A';
		this.oppLetter = 'B';
		this.playerHand = new Hand({
			x:this.local.w * defaults.hand.playerScale.x,
			y:this.local.h * defaults.hand.playerScale.y,
			w:this.local.w * defaults.hand.playerScale.w,
			h:this.local.h * defaults.hand.playerScale.h,
			parentSprite:this
		});
		this.oppHand = new Hand({
			x:this.local.w * defaults.hand.oppScale.x,
			y:this.local.h * defaults.hand.oppScale.y,
			w:this.local.w * defaults.hand.oppScale.w,
			h:this.local.h * defaults.hand.oppScale.h,
			touchEnabled:false,
			parentSprite:this
		});
		this.duel = new Duel({
			x:this.local.w * defaults.duel.scale.x,
			y:this.local.h * defaults.duel.scale.y,
			w:this.local.w * defaults.duel.scale.w,
			h:this.local.h * defaults.duel.scale.h,
			parentSprite:this
		});
		this.loadJSON(json);
	}
	loadJSON(json) {
		if(this.currentState !== json.currentState) {
			if(animations.game[this.currentState + '->'+json.currentState] !== undefined) {
				animations.game[this.currentState + '->'+json.currentState](this,json);
			} else {
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			if(json.playerA.socketID === socket.id) {
				this._iAmPrimaryPlayer = true;
				this.playerLetter = 'A';
				this.oppLetter = 'B';
			}
			if(json.playerB.socketID === socket.id) {
				this._iAmPrimaryPlayer = false;
				this.playerLetter = 'B';
				this.oppLetter = 'A';
			}
			if(json['hand'+this.playerLetter] !== undefined) {
				this.playerHand.loadJSON(json['hand' + this.playerLetter]);
			}
			if(json['hand'+this.oppLetter] !== undefined) {
				this.oppHand.loadJSON(json['hand' + this.oppLetter]);
			}
			this.duel.loadJSON(json.duel);
		}
	}
	touchEnded() {
		let didTap = super.touchEnded();
	}
	draw() {
		push();
		this.applyTransformations();
		rect(0,0,this.root.w,this.root.h);

		this.duel.draw();
		this.oppHand.draw();
		this.playerHand.draw();

		this.subSprites.forEach(function (sprite) {
			if(sprite instanceof FloatingText) {
				sprite.draw();
			}
		});
		if(this.debug) {
			this.debugDraw();
		}
		pop();
	}
	isPlayerCard(cardID) {
		for(let i = 0; i < this.playerHand.cards.length; i++) {
			if(this.playerHand.cards[i].id === cardID) {
				return true;
			}
		}
		return false;
	}
	isOppCard(cardID) {
		return !this.isPlayerCard(cardID);
	}
	get iAmPrimaryPlayer() {
		return this._iAmPrimaryPlayer;
	}
}
