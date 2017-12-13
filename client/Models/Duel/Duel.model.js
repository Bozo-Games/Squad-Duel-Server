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
				if (animations.duel[this.currentState + '->' + json.currentState] !== undefined) {
					animations.duel[this.currentState + '->' + json.currentState](this, json);
				} else {
					console.log('Unknown Duel state has changed ' + this.currentState + '->' + json.currentState);
					this.currentState = json.currentState;
					this.loadJSON(json);
				}
			} else {
				let playerCardJSON = json[`card${currentGame.playerLetter}`];
				let oppCardJSON = json[`card${currentGame.oppLetter}`];
				let playerAttackJSON = json[`attack${currentGame.playerLetter}`];
				let oppAttackJSON = json[`attack${currentGame.oppLetter}`];
				if(playerCardJSON) {
					if (this.playerCard === undefined) {
						playerCardJSON.bounds = {
							x: this.bounds.w*defaults.duel.player.x,
							y: this.bounds.h*defaults.duel.player.y,
							w: this.bounds.h*defaults.duel.player.w,
							h: this.bounds.h*defaults.duel.player.h
						};
						playerCardJSON.parentSprite = this;
						this.playerCard = new CardDuelPlayer(playerCardJSON);
					} else {
						this.playerCard.loadJSON(playerCardJSON);
					}
				}
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
		this.drawSubViews();
		pop();
	}
}