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
				x: 0,
				y: 0,
				w: 100,
				h: 40,
				fillColor: colors.card.armor
			};
			let healthDMGJSON = {
				x: 0,
				y: 0,
				w: 100,
				h: 40,
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
				healthDMGJSON.x -= duel[defender+'Card'].character.global.w;
				armorDMGJSON.x -= duel[defender+'Card'].character.global.w;
			} else {
				animations.card.oppAttackPlayer(duel.oppCard.character, duel.playerCard.character, turn,attackAnimationCallBack);
				animations.attack.attackNameSlide(duel.oppAttack, false);
				defender = 'player';
				defenderLetter = currentGame.playerLetter;
			}
			if(json['card'+currentGame.oppLetter].health !== duel[defender+'CurrentCard'].health) {
				healthDMGJSON.text = json['card' + defenderLetter].health - duel[defender+'CurrentCard'].health;
				healthDMGJSON.parentSprite = duel[defender+'Card'];
				healthDMGJSON.x += duel[defender+'Card'].character.global.x;
				healthDMGJSON.w = duel[defender+'Card'].character.global.w;
			}
			//armor
			if( json['card'+defenderLetter].armor !== duel[defender+'CurrentCard'].armor) {
				armorDMGJSON.text = json['card' + defenderLetter].armor - duel[defender+'CurrentCard'].armor;
				armorDMGJSON.parentSprite = duel[defender+'Card'];
				armorDMGJSON.x += duel[defender+'Card'].character.global.x;
				armorDMGJSON.w = duel[defender+'Card'].character.global.w;
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
		duel.acceptResultsBtn.shrinkToNothing(210);

		[duel.oppArrowResults,duel.oppEndResults,duel.oppStartResults].forEach(function (sprite) {
			sprite.moveToGlobal(-duel.global.w/1.2,sprite.global.y,function (sprite) {

			},200);
		});
		[duel.playerArrowResults,duel.playerEndResults,duel.playerStartResults].forEach(function (sprite) {
			sprite.moveToGlobal(duel.global.w/1.2,sprite.global.y,function (sprite) {

			},200);
		});

		animations.card.oppCharacterLeaves(duel.oppCard.character,function (card) {
		});

		animations.card.playerCharacterLeaves(duel.playerCard.character,function (card) {
			currentGame.removeSubSprite(currentGame.duel);
			currentGame.duel = new Duel({
				x:currentGame.local.w * defaults.duel.scale.x,
				y:currentGame.local.h * defaults.duel.scale.y,
				w:currentGame.local.w * defaults.duel.scale.w,
				h:currentGame.local.h * defaults.duel.scale.h,
				parentSprite:currentGame
			});
			currentGame.duel.loadJSON(json);
		});
	}
};