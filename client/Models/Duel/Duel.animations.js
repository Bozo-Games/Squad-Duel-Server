animations.duel = {
	"waitingForCards->waitingForAttacks": function (duel,json) {
		//hide card in opp hand
		let index = duel.oppCard.id === currentGame.oppHand.cards[1].id ? 1 : duel.oppCard.id === currentGame.oppHand.cards[2].id ? 2 : 0;
		currentGame.oppHand.cards[index].moveToGlobal(
			currentGame.oppHand.cards[index].global.x,
			-currentGame.oppHand.cards[index].h,
			undefined,
			400);

		duel.oppCard.show();

		duel.lockInButton.hide();

		duel.playerCard.attacks.forEach(function (attack) {
			attack.touchEnabled = true;
		});
		duel.currentState = json.currentState;
		duel.loadJSON(json);
	},
	"waitingForAttacks->ready":function (duel,json) {
		duel.currentState = json.currentState;
		duel.loadJSON(json);
		duel.playerCard.hideUI();
		duel.oppCard.hideUI();
	},
	"ready->newAttack":function (duel,json) {
		duel.saveCardStartStats(json);
		duel.currentState = json.currentState;
		duel.loadJSON(json);
	},
	"attackFinished->newAttack":function (duel,json) {
		duel.currentState = json.currentState;
		duel.saveCardCurrentStats(json);
		duel.loadJSON(json);
		if(currentGame.iAmPrimaryPlayer) {
			network.processDuel();
		}
	},
	"newAttack->attackFinished":function (duel,json) {
		if(duel.turns.length > 0) {
			let turn = duel.turns[0];
			duel.turns.splice(0,1);
			let armorDMGJSON = {
				bounds: {
					x: 0,
					y: 0,
					w: 100,
					h: 40
				},
				fillColor: colors.card.armor
			};
			let healthDMGJSON = {
				bounds: {
					x: 0,
					y: 0,
					w: 100,
					h: 40
				},
				fillColor: colors.card.health
			};
			let attackAnimationCallBack = function (attacker,defender) {
				if(currentGame.iAmPrimaryPlayer) {
					network.processDuel();
				}
			};
			let defender;
			let defenderLetter;
			if(turn.letter === currentGame.playerLetter) {
				animations.card.playerAttackOpp(duel.playerCard.character,duel.oppCard.character,turn,attackAnimationCallBack);
				animations.attack.attackNameSlide(duel.playerAttack,true);
				defender = 'opp';
				defenderLetter = currentGame.oppLetter;
				healthDMGJSON.global.x -= duel[defender+'Card'].character.global.w;
				armorDMGJSON.global.x -= duel[defender+'Card'].character.global.w;
			} else {
				animations.card.oppAttackPlayer(duel.oppCard.character, duel.playerCard.character, turn,attackAnimationCallBack);
				animations.attack.attackNameSlide(duel.oppAttack, false);
				defender = 'player';
				defenderLetter = currentGame.playerLetter;
			}
			if(json['card'+currentGame.oppLetter].health !== duel[defender+'CurrentCard'].health) {
				healthDMGJSON.text = json['card' + defenderLetter].health - duel[defender+'CurrentCard'].health;
				healthDMGJSON.parentSprite = duel[defender+'Card'];
				healthDMGJSON.global.x += duel[defender+'Card'].character.global.x;
				healthDMGJSON.global.w = duel[defender+'Card'].character.global.w;
			}
			//armor
			if( json['card'+defenderLetter].armor !== duel[defender+'CurrentCard'].armor) {
				armorDMGJSON.text = json['card' + defenderLetter].armor - duel[defender+'CurrentCard'].armor;
				armorDMGJSON.parentSprite = duel[defender+'Card'];
				armorDMGJSON.global.x += duel[defender+'Card'].character.global.x;
				armorDMGJSON.global.w = duel[defender+'Card'].character.global.w;
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
		duel.currentState = json.currentState;
		duel.saveCardCurrentStats(json);
		duel.loadJSON(json);
	},
	"attackFinished->displayResults": function (duel,json) {
		duel.showDuelResults();
		duel.currentState = json.currentState;
		duel.saveCardCurrentStats(json);
		duel.loadJSON(json);
	},
	"displayResults->waitingForCards":function (duel,json) {
		animations.sprite.shrinkToNothing(duel.acceptResultsBtn,210,function (button) {

		});

		[duel.oppArrowResults,duel.oppEndResults,duel.oppStartResults].forEach(function (sprite) {
			sprite.translationAnimation.appendKeyValue(new KeyValue({
				val: {x:-duel.global.w/1.2,y:0},
				endEpoch:frameTime+200,
				callBack: undefined
			}))
		});
		[duel.playerArrowResults,duel.playerEndResults,duel.playerStartResults].forEach(function (sprite) {
			sprite.translationAnimation.appendKeyValue(new KeyValue({
				val: {x:duel.global.w/1.2,y:0},
				endEpoch:frameTime+200,
				callBack: undefined
			}))
		});

		animations.card.oppCharacterLeaves(duel.oppCard.character,function (card) {
		});

		animations.card.playerCharacterLeaves(duel.playerCard.character,function (card) {
			currentGame.removeSubSprite(currentGame.duel);
			currentGame.duel = new Duel({
				bounds:{
					x:currentGame.global.x + defaults.duel.scale.x*currentGame.global.w,
					y:currentGame.global.y + defaults.duel.scale.y*currentGame.global.h,
					w:currentGame.global.w * defaults.duel.scale.w,
					h:currentGame.global.h * defaults.duel.scale.h,
				},
				parentSprite:currentGame
			});
			currentGame.duel.loadJSON(json);
		});
	}
};