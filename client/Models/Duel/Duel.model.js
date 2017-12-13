class Duel extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		json = json === undefined ? {} : json;
		this.forceDrawCancel = false;
		this.currentState = json.currentState;
		this.activeAnimations = [];
		this.loadJSON(json);
	}
	loadJSON(json){
		console.log('duel loading ' + this.currentState +' vs '+json.currentState);
		this.attacker = json.attacker === currentGame.playerLetter ?'player': 'opp' ;
		this.defender = json.defender === currentGame.playerLetter ? 'player':'opp';
		if(this.currentState !== json.currentState) {
			let animation;
			if(animations.duel[`${this.currentState}->${json.currentState}`] !== undefined) {
				animation = animations.duel[`${this.currentState}->${json.currentState}`](this, function (duel) {
					duel.currentState = json.currentState;
					duel.loadJSON(json);
				});
				console.log(`${this.currentState}->${json.currentState} is here as `+animation);
				if (animation !== undefined) {
					this.activeAnimations = this.activeAnimations.concat(animation);
				} else {
					this.currentState = json.currentState;
					this.loadJSON(json);
				}
			} else {
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			let playerCardJSON = json[`card${currentGame.playerLetter}`];
			let oppCardJSON = json[`card${currentGame.oppLetter}`];
			let playerAttackJSON = json[`attack${currentGame.playerLetter}`];
			let oppAttackJSON = json[`attack${currentGame.oppLetter}`];

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
				let newCard = new Card(oppCardJSON);
				this.oppCard = newCard;
			} else if(oppCardJSON !== undefined) {
				if(oppCardJSON.id !== this.oppCard.id) {
					let newCard = new Card(oppCardJSON);
					currentGame.duel.oppCard = newCard;
				} else {
					this.oppCard.loadJSON(oppCardJSON);
				}
			}
			if(playerAttackJSON) {
				if (this.playerAttack === undefined) {
					this.playerAttack = new Attack(playerAttackJSON);
				} else {
					this.playerAttack.loadJSON(playerAttackJSON);
				}
			}
			if(oppAttackJSON) {
				if (this.oppAttack === undefined) {
					this.oppAttack = new Attack(oppAttackJSON);
				} else {
					this.oppAttack.loadJSON(oppAttackJSON);
				}
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
		let shouldExitDraw = super.applyActiveAnimations();
		if(shouldExitDraw) {
			pop();
			return true;
		}
		if(this.shouldDrawPlayer) {
			push();
			translate(
				defaults.duel.playerCard.offset.x(),
				defaults.duel.playerCard.offset.y());
			this.playerCard.draw();
			pop();
		}
		if(this.shouldDrawOpp) {
			push();
			translate(
				defaults.duel.oppCard.offset.x(),
				defaults.duel.oppCard.offset.y());
			this.oppCard.draw();
			pop();
		}
		super.drawFloatingText();
		pop();
	}
	get shouldDrawPlayer() {
		if(this.playerCard !== undefined) {
			return (this.playerCard.currentState !== 'inHand');
		}
		return false;
	}
	get shouldDrawOpp() {
		if(this.oppCard !== undefined) {
			if(this.oppCard.currentState === 'lockedIn') {
				return currentGame.currentState === 'attackSelectStage' || currentGame.currentState === 'readyToDuel';
			} else if(this.oppCard.currentState === 'dueling') {
				return true;
			}
		}
		return false;
	}
}