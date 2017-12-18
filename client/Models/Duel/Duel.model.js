class Duel extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		this.currentState = 'waitingForCards';

		console.log('duel - '+JSON.stringify(this.bounds));
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
						playerCardJSON.x = this.w*defaults.duel.player.x;
						playerCardJSON.y = this.h*defaults.duel.player.y;
						playerCardJSON.w = this.w*defaults.duel.player.w;
						playerCardJSON.h = this.h*defaults.duel.player.h;
						playerCardJSON.parentSprite = this;
						this.playerCard = new CardDuelPlayer(playerCardJSON);

						this.lockInButton = new ButtonLockIn({
							x:this.w*defaults.duel.lockInButton.x,
							y:this.h*defaults.duel.lockInButton.y,
							w:this.w*defaults.duel.lockInButton.w,
							h:this.h*defaults.duel.lockInButton.h,
							parentSprite:this,
						});
						this.lockInButton.debug = true;
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

	showDuelResults() {
		let statHeight = this.playerCard.bounds.h*defaults.card.duel.player.statBoxScale.h;
		let statWidth = this.playerCard.bounds.w*defaults.card.duel.player.statBoxScale.w;

		this.playerStartCard.bounds = {
			x: this.playerCard.character.bounds.x + this.playerCard.character.bounds.w,
			y: this.playerCard.bounds.y+(this.playerCard.bounds.h-statHeight)/2,
			w: statWidth,
			h: statHeight
		};
		this.playerStartCard.parentSprite = this;
		this.playerCurrentCard.bounds = {
			x: this.playerCard.character.bounds.x+this.playerCard.character.bounds.w+statWidth+30,
			y: this.playerCard.bounds.y+(this.playerCard.bounds.h-statHeight)/2,
			w: statWidth,
			h: statHeight
		};
		this.playerCurrentCard.parentSprite = this;
		this.playerStartResults = new CardDuelStats(this.playerStartCard);
		this.playerEndResults = new CardDuelStats(this.playerCurrentCard);
		this.playerArrowResults = new FloatingText({
			bounds: {
				x:this.playerCard.character.bounds.x+this.playerCard.character.bounds.w+statWidth,
				y:this.playerCard.bounds.y+(this.playerCard.bounds.h-20)/2,
				w:30,
				h:20
			},
			text:"=>",
			parentSprite:this
		});


		this.oppStartCard.bounds = {
			x: this.oppCard.character.bounds.x - this.oppCard.character.bounds.w - statWidth - 30,
			y: this.oppCard.bounds.y+(this.oppCard.bounds.h-statHeight)/2,
			w: statWidth,
			h: statHeight
		};
		this.oppStartCard.parentSprite = this;
		this.oppCurrentCard.bounds = {
			x: this.oppCard.character.bounds.x-this.oppCard.character.bounds.w,
			y: this.oppCard.bounds.y+(this.oppCard.bounds.h-statHeight)/2,
			w: statWidth,
			h: statHeight
		};
		this.oppCurrentCard.parentSprite = this;
		this.oppStartResults = new CardDuelStats(this.oppStartCard);
		this.oppEndResults = new CardDuelStats(this.oppCurrentCard);
		this.oppArrowResults = new FloatingText({
			bounds: {
				x:this.oppCard.character.bounds.x-this.oppCard.character.bounds.w - 30,
				y:this.oppCard.bounds.y+(this.oppCard.bounds.h-20)/2,
				w:30,
				h:20
			},
			text:"=>",
			parentSprite:this
		});

		this.acceptResultsBtn = new ButtonAcceptReuslt({
			bounds: {
				x:this.bounds.x + (this.bounds.w- statWidth)/2 ,
				y:(this.bounds.h-statWidth)/2,// - (this.bounds.h-statWidth)/2 ,
				w:statWidth,
				h:statWidth
			},
			parentSprite:this
		});

		this.playerCard.character.loadJSON(this.playerCurrentCard);
		this.oppCard.character.loadJSON(this.oppCurrentCard);
	}

	touchEnded() {
		let didTap = super.touchEnded();
	}
	draw() {
		push();
		this.applyTransformations();
		this.drawSubSprites();
		pop();
	}
}