class Duel {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.currentState = json.currentState;
		this.activeAnimations = [];
		this.loadJSON(json);
		console.log(this.activeAnimations);
	}
	loadJSON(json){
		if(this.currentState !== json.currentState) {
			let animation = animations.duel[`${this.currentState}->${json.currentState}`](this,function (card) {
				card.currentState = json.currentState;
				card.loadJSON(json);
			});
			if(animation !== undefined) {
				this.activeAnimations.concat(animation);
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
				this.playerCard = new Card(playerCardJSON);
				this.activeAnimations.concat(animations.duel.playerSelectsCard(this.playerCard,function () {}));
			} else if(playerCardJSON !== undefined) {
				if(playerCardJSON.id !== this.playerCard.id) {
					this.playerCard.activeAnimations.concat(animations.duel.playerSwitchCard(this.playerCard,function () {
						this.playerCard.loadJSON(playerCardJSON);
						this.activeAnimations.concat(animations.duel.playerSelectsCard(this.playerCard,function () {}));
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
	draw() {
		push();
		let i = 0;
		while(i < this.activeAnimations.length && i >= 0) {
			console.log('here')
			this.activeAnimations[i].applyEffect();
			if(this.activeAnimations[i].isDone) {
				this.activeAnimations[i].callBack(this);
				this.activeAnimations.splice(i,1);
				i --;
			} else {
				i++;
			}
		}
		if(this.playerCard !== undefined) {
			translate(50,height*0.4);
			if(this.playerCard.currentState !== 'inHand') {
				this.playerCard.draw();
			}
		}
		pop();
	}
}