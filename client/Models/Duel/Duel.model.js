class Duel extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		this.currentState = 'waitingForCards';

		this.loadJSON(json);
	}
	loadJSON(json){
		if(currentGame !== undefined) {
			this.attacker = json.attacker === currentGame.playerLetter ? 'player' : 'opp';
			this.defender = json.defender === currentGame.playerLetter ? 'player' : 'opp';
			if (this.currentState !== json.currentState) {
				console.log('duel state change '+this.currentState + '->' + json.currentState);
				if (animations.duel[this.currentState + '->' + json.currentState] !== undefined) {
					animations.duel[this.currentState + '->' + json.currentState](this, json);
				} else {
					this.currentState = json.currentState;
					this.loadJSON(json);
				}
			} else {
				let playerCardJSON = json[`card${currentGame.playerLetter}`];
				if(playerCardJSON !== undefined) {
					if (this.playerCard === undefined) {
						playerCardJSON.bounds = {
							x: this.bounds.w*defaults.duel.player.x,
							y: this.bounds.h*defaults.duel.player.y,
							w: this.bounds.w*defaults.duel.player.w,
							h: this.bounds.h*defaults.duel.player.h
						};
						playerCardJSON.parentSprite = this;
						this.playerCard = new CardDuelPlayer(playerCardJSON);
					} else {
						this.playerCard.loadJSON(playerCardJSON);
					}
				}
				let playerAttackJSON = json[`attack${currentGame.playerLetter}`];
				if(playerAttackJSON !== undefined) {
					if(this.playerAttack === undefined) {
						playerAttackJSON.bounds = {
							x:0,
							y:0,
							w:this.bounds.w,
							h:this.bounds.h
						};
						playerAttackJSON.parentSprite = this;
						this.playerAttack = new AttackComat(playerAttackJSON);
						this.playerAttack.translationAnimation.forceUpdate({x:-this.bounds.w,y:0});
					} else {
						this.playerAttack.loadJSON(playerAttackJSON);
					}
				}
				let oppCardJSON = json[`card${currentGame.oppLetter}`];
				if(oppCardJSON !== undefined) {
					if (this.oppCard === undefined) {
						oppCardJSON.bounds = {
							x: this.bounds.w*defaults.duel.opp.x,
							y: this.bounds.h*defaults.duel.opp.y,
							w: this.bounds.w*defaults.duel.opp.w,
							h: this.bounds.h*defaults.duel.opp.h
						};
						oppCardJSON.parentSprite = this;
						this.oppCard = new CardDuelOpp(oppCardJSON);
					} else {
						this.oppCard.loadJSON(oppCardJSON);
					}
				}
				let oppAttackJSON = json[`attack${currentGame.oppLetter}`];
				if(oppAttackJSON !== undefined) {
					if(this.oppAttack === undefined) {
						oppAttackJSON.bounds = {
							x:0,
							y:0,
							w:this.bounds.w,
							h:this.bounds.h
						};
						oppAttackJSON.parentSprite = this;
						this.oppAttack = new AttackComat(oppAttackJSON);
						this.oppAttack.translationAnimation.forceUpdate({x:-this.bounds.w,y:0})
					} else {
						this.oppAttack.loadJSON(oppAttackJSON);
					}
				}
			}
		}
	}
	saveCardStartStats(json){
		this.playerStartCard = json['card'+currentGame.playerLetter];
		this.oppStartCard = json['card'+currentGame.oppLetter];
		this.turns = json.turns;
		this.saveCardCurrentStats(json);
	}
	saveCardCurrentStats(json){
		this.playerCurrentCard = json['card'+currentGame.playerLetter];
		this.oppCurrentCard = json['card'+currentGame.oppLetter];
		this.turns = json.turns;
	}

	touchEnded() {
		pushMouse();
		let didTap = super.touchEnded();
		popMouse();
	}
	draw() {
		push();
		this.applyAnimations();
		this.drawSubViews();
		pop();
	}
}