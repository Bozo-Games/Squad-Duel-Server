class Game {
	constructor(json) {
		this.currentState = json.currentState;
		this._iAmPrimaryPlayer = false;
		this.loadJSON(json)
	}
	loadJSON(json) {
		console.log('updating game json');
		if(this.currentState !== json.currentState) {
			let animation;
			if(animations.game[`${this.currentState}->${json.currentState}`] !== undefined) {
				animation = animations.game[`${this.currentState}->${json.currentState}`](this, function (game) {
					game.currentState = json.currentState;
					game.loadJSON(json);
				});
			}
			if(animation !== undefined) {
				this.activeAnimations = this.activeAnimations.concat(animation);
			} else {
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			//--------------------------------------- Players
			let playerA = new Player(json.playerA);
			let playerB = new Player(json.playerB);
			if(playerA.isMe) {
				this._iAmPrimaryPlayer = true;
				this.playerLetter = 'A';
				this.oppLetter = 'B';
			} else if(playerB.isMe) {
				this.playerLetter = 'B';
				this.oppLetter = 'A';
			}
			if(this.player === undefined) {
				this.player =  new Player(json[`player${this.playerLetter}`]);
			} else {
				//this.player.loadJSON(json[`player${this.playerLetter}`]);
			}
			if(this.opp === undefined) {
				this.opp =  new Player(json[`player${this.oppLetter}`]);
			} else {
				//this.opp.loadJSON(json[`player${this.oppLetter}`]);
			}
			//----------------------------------------- Hands
			if(this.playerHand === undefined) {
				this.playerHand = new Hand(json[`hand${this.playerLetter}`]);
			} else {
				this.playerHand.loadJSON(json[`hand${this.playerLetter}`]);
			}
			if(this.oppHand === undefined) {
				this.oppHand = new Hand(json[`hand${this.oppLetter}`]);
			} else {
				this.oppHand.loadJSON(json[`hand${this.oppLetter}`]);
			}
			//----------------------------------------- Duel
			if(this.duel === undefined && currentGame !== undefined) {
				this.duel = new Duel(json.duel);
			} else if(this.duel !== undefined) {
				this.duel.loadJSON(json.duel);
			}
		}
	}
	touchEnded() {
		pushMouse();
		if(this.duel !== undefined) {
			this.duel.touchEnded();
		}
		if(this.playerHand !== undefined) {
			let isHandActive = true;
			if(this.duel !== undefined) {
				if(this.duel.playerCard !== undefined) {
					isHandActive = (
						this.duel.playerCard.currentState === 'inHand' ||
						this.duel.playerCard.currentState === 'selected' );
				}
			}
			if(isHandActive) {
				pushMouse();
				translateMouse(
					defaults.game.playerHand.offset.x(),
					defaults.game.playerHand.offset.y());
				this.playerHand.touchEnded();
				popMouse();
			}
		}
		popMouse();
	}
	draw() {
		if(this.duel !== undefined) {
			push();
			this.duel.draw();
			pop();
		}
		if(this.playerHand !== undefined) {
			push();
			translate(
				defaults.game.playerHand.offset.x(),
				defaults.game.playerHand.offset.y());
			this.playerHand.draw();
			pop();
		}
		if(this.oppHand !== undefined) {
			push();
			translate(
				defaults.game.oppHand.offset.x(),
				defaults.game.oppHand.offset.y());
			this.oppHand.draw();
			pop();
		}
		if(this.player !== undefined) {this.player.draw();}
		if(this.opp !== undefined) {this.opp.draw();}
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