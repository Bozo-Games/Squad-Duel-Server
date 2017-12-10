class Game {
	constructor(json) {
		this.currentState = json.currentState;
		this.loadJSON(json)
	}
	loadJSON(json) {
		if(this.currentState !== json.currentState) {
			let animation = animations.game[`${this.currentState}->${json.currentState}`];
			if(animation !== undefined) {
				animation(function () {
					this.currentState = json.currentState;
					this.loadJSON(json);
				});
			}
		} else {
			//--------------------------------------- Players
			let playerA = new Player(json.playerA);
			let playerB = new Player(json.playerB);
			if(playerA.isMe) {
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
		if(this.playerHand !== undefined) {
			pushMouse();
			translateMouse(
				defaults.game.playerHand.offset.x(),
				defaults.game.playerHand.offset.y());
			this.playerHand.touchEnded();
			popMouse();
		}
		popMouse();
	}
	draw() {
		if(this.player !== undefined) {this.player.draw();}
		if(this.opp !== undefined) {this.opp.draw();}
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
		if(this.duel !== undefined) {
			push();
			this.duel.draw();
			pop();
		}
	}
	isPlayerCard(cardID) {
		for(let i = 0; i < this.playerHand.cards.length; i++) {
			if(this.playerHand.cards[i].id === cardID) {
				return true;
			}
		}
		return false;
	}
}