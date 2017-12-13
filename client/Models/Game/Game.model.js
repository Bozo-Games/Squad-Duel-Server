class Game extends Sprite {
	constructor(json) {
		super({
			bounds:{
				x:0,
				y:0,
				w:width,
				h:height
			},
			fillColor:colors.game.background
		});
		this.currentState = 'newGame';
		this._iAmPrimaryPlayer = false;
		this.playerLetter = 'A';
		this.oppLetter = 'B';
		this.playerHand = new Hand({
			bounds:{
				x:0,
				y:this._bounds.h * 0.8,
				w:this._bounds.w,
				h:this._bounds.h * 0.2
			}
		});
		this.oppHand = new Hand({
			bounds:{
				x:0,
				y:0,
				w:this._bounds.w,
				h:this._bounds.h * 0.2
			},
			touchEnabled:false,
		});
		this.addSubSprite(this.playerHand);
		this.addSubSprite(this.oppHand);
		this.loadJSON(json);
	}
	loadJSON(json) {
		console.log('Updating game json');
		if(this.currentState !== json.currentState) {
			if(animations.game[this.currentState + '->'+json.currentState] !== undefined) {
				animations.game[this.currentState + '->'+json.currentState](this,json);
			} else {
				console.log('Unknown Game state has changed '+this.currentState + '->'+json.currentState);
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
		}
	}
	touchEnded() {
		pushMouse();
		let didTap = super.touchEnded();
		popMouse();
	}
	draw() {
		push();
		this.applyAnimations();
		rect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h);
		this.drawSubViews();
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
