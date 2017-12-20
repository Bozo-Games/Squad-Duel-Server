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
				return this.stateChangeAnimation(this.currentState,json.currentState,json);
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

	touchEnded() {
		let didTap = super.touchEnded();
	}
	draw() {
		push();
		this.applyTransformations();
		this.drawSubSprites();
		pop();
	}
	//-------------------------------------------------------------------------- animations
	stateChangeAnimation(from,to,json) {
		if(from === 'waitingForCards' && to === 'waitingForAttacks') {
			this.showOppForAttackSelect();
			this.currentState = to;
			return this.loadJSON(json);
		} else if(from === 'waitingForAttacks' && to === 'ready') {
			this.haveCardsHideUI();
			this.currentState = to;
			return this.loadJSON(json);
		} else if(from === 'ready' && to === 'newAttack') {
			this.currentState = json.currentState;
			this.saveCardStartStats(json);
			this.saveCardCurrentStats(json);
			this.loadJSON(json);
		} else if(from === 'newAttack' && to === 'attackFinished') {
			this.showAttackHappening(json);
			this.currentState = json.currentState;
			this.saveCardCurrentStats(json);
			this.loadJSON(json);
		} else if(from === 'attackFinished' && to === 'newAttack') {
			this.currentState = json.currentState;
			this.saveCardCurrentStats(json);
			this.loadJSON(json);
			if(currentGame.iAmPrimaryPlayer) {
				network.processDuel();
			}
		} else if(from === 'attackFinished' && to === 'displayResults') {
			this.showDuelResults();
			this.currentState = to;
			return this.loadJSON(json);
		}else if(from === 'displayResults' && to === 'waitingForCards') {
			this.hideDuelResultsAndReset(json);
			return false;
		} else {
			console.log(this.constructor.name + ' is changing state from (' + from + ') to (' + to + ') without animation');
			this.currentState = to;
			return this.loadJSON(json);
		}
	}
	hideDuelResultsAndReset(json) {
		this.acceptResultsBtn.shrinkToNothing(210);
		this.playerStartResults.shrinkToNothing(210);
		this.playerEndResults.shrinkToNothing(210);
		this.playerArrowResults.shrinkToNothing(210);
		this.oppStartResults.shrinkToNothing(210);
		this.oppEndResults.shrinkToNothing(210);
		this.oppArrowResults.shrinkToNothing(210);

		this.playerCard.character.playerWalkOut();
		this.oppCard.character.playerWalkOut();

		this.holdAnimation(function (duel) {
			currentGame.removeSubSprite(currentGame.duel);
			currentGame.duel = new Duel({
				x:currentGame.local.w * defaults.duel.scale.x,
				y:currentGame.local.h * defaults.duel.scale.y,
				w:currentGame.local.w * defaults.duel.scale.w,
				h:currentGame.local.h * defaults.duel.scale.h,
				parentSprite:currentGame
			});
			currentGame.duel.loadJSON(json);
		},1000);

	}
	haveCardsHideUI() {
		this.playerCard.hideUI();
		this.oppCard.hideUI();
	}
	showOppForAttackSelect() {
		let index = this.oppCard.id === currentGame.oppHand.cards[1].id ? 1 : this.oppCard.id === currentGame.oppHand.cards[2].id ? 2 : 0;
		currentGame.oppHand.cards[index].moveOffUp();
		this.oppCard.show();
		this.lockInButton.hide();
		this.playerCard.attacks.forEach(function (attack) {
			attack.touchEnabled = true;
		});
	}
	showAttackHappening(json) {
		if(this.turns.length >0) {
			let turn = this.turns[0];
			this.turns.splice(0,1);
			let armorDMGJSON = {x: 0,y: 0,w: 100,h: 40,fillColor: colors.card.armor};
			let healthDMGJSON = {x: 0,y: 0,w: 100,h: 40,fillColor: colors.card.health};
			let attackAnimationCallBack = function (attacker,defender) {
				if(currentGame.iAmPrimaryPlayer) {
					network.processDuel();
				}
			};
			let defender;
			let defenderLetter;
			if(turn.letter === currentGame.playerLetter) {
				this.playerCard.character.attackCharacter(this.oppCard.character,turn.powerMultiplier,attackAnimationCallBack);
				defender = 'opp';
				defenderLetter = currentGame.oppLetter;
				healthDMGJSON.x -= this[defender+'Card'].character.root.w;
				armorDMGJSON.x -= this[defender+'Card'].character.root.w;
			} else {
				this.oppCard.character.attackCharacter(this.playerCard.character,turn.powerMultiplier,attackAnimationCallBack);
				defender = 'player';
				defenderLetter = currentGame.playerLetter;
			}

			let duel = this;
			if(json['card'+currentGame.oppLetter].health !== this[defender+'CurrentCard'].health) {
				healthDMGJSON.text = json['card' + defenderLetter].health - this[defender+'CurrentCard'].health;
				healthDMGJSON.parentSprite = this[defender+'Card'];
				healthDMGJSON.x += this[defender+'Card'].character.root.x;
				healthDMGJSON.w = this[defender+'Card'].character.root.w;
			}
			//armor
			if( json['card'+defenderLetter].armor !== this[defender+'CurrentCard'].armor) {
				armorDMGJSON.text = json['card' + defenderLetter].armor - this[defender+'CurrentCard'].armor;
				armorDMGJSON.parentSprite = this[defender+'Card'];
				armorDMGJSON.x += this[defender+'Card'].character.root.x;
				armorDMGJSON.w = this[defender+'Card'].character.root.w;
				let armorMsg = new FloatingText(armorDMGJSON);
				armorMsg.floatAway(function (floatingText) {
					floatingText.parentSprite.removeSubSprite(floatingText);
					if(json['card'+currentGame.oppLetter].health !== duel[defender+'CurrentCard'].health) {
						let healthMsg = new FloatingText(healthDMGJSON);
						healthMsg.floatAway(function (floatingText) {
							floatingText.parentSprite.removeSubSprite(floatingText);
						});
					}
				});
			} else if(json['card'+currentGame.oppLetter].health !== duel[defender+'CurrentCard'].health) {
				let healthMsg = new FloatingText(healthDMGJSON);
				healthMsg.floatAway(function (floatingText) {
					floatingText.parentSprite.removeSubSprite(floatingText);
				});
			}
		}
	}

	showDuelResults() {
		let statHeight = this.playerCard.h*defaults.card.duel.player.statBoxScale.h;
		let statWidth = this.playerCard.w*defaults.card.duel.player.statBoxScale.w;

		this.playerStartCard.x = this.playerCard.character.x + this.playerCard.character.w;
		this.playerStartCard.y = (this.playerCard.h-statHeight)/2;
		this.playerStartCard.w = statWidth;
		this.playerStartCard.h = statHeight;
		this.playerStartCard.parentSprite = this.playerCard;

		this.playerCurrentCard.x = this.playerCard.character.x+this.playerCard.character.w+statWidth+30;
		this.playerCurrentCard.y = (this.playerCard.h-statHeight)/2;
		this.playerCurrentCard.w = statWidth;
		this.playerCurrentCard.h = statHeight;
		this.playerCurrentCard.parentSprite = this.playerCard;

		this.playerStartResults = new CardDuelStats(this.playerStartCard);
		this.playerEndResults = new CardDuelStats(this.playerCurrentCard);

		this.playerArrowResults = new FloatingText({
			x:this.playerCard.character.x+this.playerCard.character.w+statWidth,
			y:(this.playerCard.h-20)/2,
			w:30,
			h:20,
			text:"=>",
			color:'#000',
			parentSprite:this.playerCard
		});

		this.oppStartCard.x = this.oppCard.character.x - statWidth - 30-this.oppCard.character.w/2;
		this.oppStartCard.y = (this.oppCard.h-statHeight)/2;
		this.oppStartCard.w = statWidth;
		this.oppStartCard.h = statHeight;
		this.oppStartCard.parentSprite = this.oppCard;

		this.oppCurrentCard.x = this.oppCard.character.x-this.oppCard.character.w/2;
		this.oppCurrentCard.y = (this.oppCard.h-statHeight)/2;
		this.oppCurrentCard.w = statWidth;
		this.oppCurrentCard.h = statHeight;
		this.oppCurrentCard.parentSprite = this.oppCard;

		this.oppStartResults = new CardDuelStats(this.oppStartCard);
		this.oppEndResults = new CardDuelStats(this.oppCurrentCard);

		this.oppArrowResults = new FloatingText({
			x:this.oppCard.character.x-this.oppCard.character.w/2 - 30,
			y:(this.oppCard.h-20)/2,
			w:30,
			h:20,
			text:"=>",
			color:'#000',
			parentSprite:this.oppCard
		});

		this.acceptResultsBtn = new ButtonAcceptReuslt({
			x:this.x + (this.w- statWidth)/2 ,
			y:(this.h-statWidth)/2,// - (this.global.h-statWidth)/2 ,
			w:statWidth,
			h:statWidth,
			parentSprite:this
		});

		this.playerCard.character.loadJSON(this.playerCurrentCard);
		this.oppCard.character.loadJSON(this.oppCurrentCard);
	}

}