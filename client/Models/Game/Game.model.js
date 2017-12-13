class Game extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
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
				x:this.bounds.x + defaults.hand.playerScale.x*this.bounds.w,
				y:this.bounds.y + defaults.hand.playerScale.y*this.bounds.h,
				w:this.bounds.w * defaults.hand.playerScale.w,
				h:this.bounds.h * defaults.hand.playerScale.h,
			}
		});
		this.oppHand = new Hand({
			bounds:{
				x:this.bounds.x + defaults.hand.oppScale.x*this.bounds.w,
				y:this.bounds.y + defaults.hand.oppScale.y*this.bounds.h,
				w:this.bounds.w * defaults.hand.oppScale.w,
				h:this.bounds.h * defaults.hand.oppScale.h,
			},
			touchEnabled:false,
		});
		this.duel = new Duel({
			bounds:{
				x:this.bounds.x + defaults.duel.scale.x*this.bounds.w,
				y:this.bounds.y + defaults.duel.scale.y*this.bounds.h,
				w:this.bounds.w * defaults.duel.scale.w,
				h:this.bounds.h * defaults.duel.scale.h,
			}
		});
		this.addSubSprite(this.playerHand);
		this.addSubSprite(this.oppHand);
		this.addSubSprite(this.duel);
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
			this.duel.loadJSON(json.duel);
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
		this.duel.draw();
		this.oppHand.draw();
		this.playerHand.draw();
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
