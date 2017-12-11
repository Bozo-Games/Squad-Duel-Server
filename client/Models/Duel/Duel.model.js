class Duel {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.forceDrawCancel = false;
		this.currentState = json.currentState;
		this.activeAnimations = [];
		this.loadJSON(json);
	}
	loadJSON(json){
		if(this.currentState !== json.currentState) {
			let animation = animations.duel[`${this.currentState}->${json.currentState}`](this,function (card) {
				card.currentState = json.currentState;
				card.loadJSON(json);
			});
			if(animation !== undefined) {
				this.activeAnimations = this.activeAnimations.concat(animation);
			} else {
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			let playerCardJSON = json[`card${currentGame.playerLetter}`];
			let oppCardJSON = json[`card${currentGame.playerLetter}`];
			let playerAttackJSON = json[`card${currentGame.oppLetter}`];
			let oppAttackJSON = json[`card${currentGame.oppLetter}`];

			if(this.playerCard === undefined && playerCardJSON !== undefined) {
				let newCard = new Card(playerCardJSON);
				newCard.activeAnimations = newCard.activeAnimations.concat(
					animations.duel.playerSelectsCard(newCard,function () {})
				);
				this.playerCard = newCard;
			} else if(playerCardJSON !== undefined) {
				if(playerCardJSON.id !== this.playerCard.id) {
					this.playerCard.activeAnimations = this.playerCard.activeAnimations.concat(
						animations.duel.playerSwitchCard(this,this.playerCard,function (card) {
							let newCard = new Card(playerCardJSON);
							newCard.activeAnimations = newCard.activeAnimations.concat(
									animations.duel.playerSelectsCard(newCard,function () {})
							);
							currentGame.duel.playerCard.forceDrawCancel = true;
							currentGame.duel.playerCard = newCard;
					}));
				} else {
					this.playerCard.loadJSON(playerCardJSON);
				}
			}

			if(this.oppCard === undefined && oppCardJSON !== undefined) {
				this.oppCard = new Card(oppCardJSON);
			} else if(oppCardJSON !== undefined) {
				this.oppCard.loadJSON(oppCardJSON);
			}
		}
	}
	touchEnded() {
		pushMouse();
		if(this.playerCard !== undefined) {
			pushMouse();
			translateMouse(
				defaults.duel.playerCard.offset.x(),
				defaults.duel.playerCard.offset.y());
			if (this.playerCard.currentState !== 'inHand') {
				this.playerCard.touchEnded();
			}
			popMouse();
		}
		popMouse();
	}
	draw() {
		push();
		let i = 0;
		while(i < this.activeAnimations.length && i >= 0) {
			if(this.activeAnimations[i].isDone) {
				this.activeAnimations[i].callBack(this);
				this.activeAnimations.splice(i,1);
				pop();
				if(this.forceDrawCancel) {
					this.forceDrawCancel = false;
					return true;
				}
				push();
				i = 0;
			} else {
				this.activeAnimations[i].applyEffect();
				i++;
			}
		}
		if(this.playerCard !== undefined) {
			push();
			translate(
				defaults.duel.playerCard.offset.x(),
				defaults.duel.playerCard.offset.y());
			if(this.playerCard.currentState !== 'inHand') {
				this.playerCard.draw();
			}
			pop();
		}
		pop();
	}
}