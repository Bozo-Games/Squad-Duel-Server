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