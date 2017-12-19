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
					if(this.playerAttack === undefined) { //TODO move sizing to setting
						playerAttackJSON.x = 0;
						playerAttackJSON.y = 0;
						playerAttackJSON.w = this.w;
						playerAttackJSON.h = this.h;
						playerAttackJSON.animation = {
							x:-this.w
						};
						playerAttackJSON.parentSprite = this;
						this.playerAttack = new AttackComat(playerAttackJSON);
					} else {
						this.playerAttack.loadJSON(playerAttackJSON);
					}
				}
				let oppCardJSON = json[`card${currentGame.oppLetter}`];
				if(oppCardJSON !== undefined) {
					if (this.oppCard === undefined) {
						oppCardJSON.x = this.w*defaults.duel.opp.x;
						oppCardJSON.y = this.h*defaults.duel.opp.y;
						oppCardJSON.w = this.w*defaults.duel.opp.w;
						oppCardJSON.h = this.h*defaults.duel.opp.h;
						oppCardJSON.parentSprite = this;
						this.oppCard = new CardDuelOpp(oppCardJSON);
						this.oppCard.debug = true;
					} else {
						this.oppCard.loadJSON(oppCardJSON);
					}
				}
				let oppAttackJSON = json[`attack${currentGame.oppLetter}`];
				if(oppAttackJSON !== undefined) {
					if(this.oppAttack === undefined) {
						oppAttackJSON.x = 0;
						oppAttackJSON.y = 0;
						oppAttackJSON.w = this.w;
						oppAttackJSON.h = this.h;
						oppAttackJSON.animation = {
							x:-this.w
						};
						oppAttackJSON.parentSprite = this;
						this.oppAttack = new AttackComat(oppAttackJSON);
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
		let statHeight = this.playerCard.h*defaults.card.duel.player.statBoxScale.h;
		let statWidth = this.playerCard.w*defaults.card.duel.player.statBoxScale.w;

		this.playerStartCard.x = this.playerCard.character.x + this.playerCard.character.w;
		this.playerStartCard.y = this.playerCard.y+(this.playerCard.h-statHeight)/2;
		this.playerStartCard.w = statWidth;
		this.playerStartCard.h = statHeight;
		this.playerStartCard.parentSprite = this;

		this.playerCurrentCard.x = this.playerCard.character.x+this.playerCard.character.w+statWidth+30;
		this.playerCurrentCard.y = this.playerCard.y+(this.playerCard.h-statHeight)/2;
		this.playerCurrentCard.w = statWidth;
		this.playerCurrentCard.h = statHeight;
		this.playerCurrentCard.parentSprite = this;

		this.playerStartResults = new CardDuelStats(this.playerStartCard);
		this.playerEndResults = new CardDuelStats(this.playerCurrentCard);

		this.playerArrowResults = new FloatingText({
			x:this.playerCard.character.x+this.playerCard.character.w+statWidth,
			y:this.playerCard.y+(this.playerCard.h-20)/2,
			w:30,
			h:20,
			text:"=>",
			color:'#000',
			parentSprite:this
		});


		this.oppStartCard.x = this.oppCard.character.x - this.oppCard.character.w - statWidth - 30;
		this.oppStartCard.y = this.oppCard.y+(this.oppCard.h-statHeight)/2;
		this.oppStartCard.w = statWidth;
		this.oppStartCard.h = statHeight;
		this.oppStartCard.parentSprite = this;

		this.oppCurrentCard.x = this.oppCard.character.x-this.oppCard.character.w;
		this.oppCurrentCard.y = this.oppCard.y+(this.oppCard.h-statHeight)/2;
		this.oppCurrentCard.w = statWidth;
		this.oppCurrentCard.h = statHeight;
		this.oppCurrentCard.parentSprite = this;

		this.oppStartResults = new CardDuelStats(this.oppStartCard);
		this.oppEndResults = new CardDuelStats(this.oppCurrentCard);

		this.oppArrowResults = new FloatingText({
			bounds: {
				x:this.oppCard.character.x-this.oppCard.character.w - 30,
				y:this.oppCard.y+(this.oppCard.h-20)/2,
				w:30,
				h:20
			},
			text:"=>",
			color:'#000',
			parentSprite:this
		});

		this.acceptResultsBtn = new ButtonAcceptReuslt({
			x:this.x + (this.w- statWidth)/2 ,
			y:(this.h-statWidth)/2,// - (this.bounds.h-statWidth)/2 ,
			w:statWidth,
			h:statWidth,
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