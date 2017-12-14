animations.duel = {
	"waitingForCards->waitingForAttacks": function (duel,json) {
		duel.oppCard.show();

		animations.button.lockIn.hide(duel.playerCard.lockInBtn);
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
	},
	"ready->newAttack":function (duel,json) {
		duel.saveCardStartStates(json);
		duel.currentState = json.currentState;
		duel.loadJSON(json);
	},
	"newAttack->attackFinished":function (duel,json) {
		if(duel.turns.length > 0) {
			let turn = duel.turns[0];
			duel.turns.splice(0,1);

			if(turn.letter === currentGame.playerLetter) {
				animations.card.playerAttackOpp(duel.playerCard.character,duel.oppCard.character,turn);
				animations.attack.attackNameSlide(duel.playerAttack,true);
			} else {
				animations.card.oppAttackPlayer(duel.oppCard.character,duel.playerCard.character,turn);
				animations.attack.attackNameSlide(duel.oppAttack,false);
			}

		}


		duel.currentState = json.currentState;
		duel.loadJSON(json);
	},
};