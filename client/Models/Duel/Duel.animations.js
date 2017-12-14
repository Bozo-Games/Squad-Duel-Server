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
		duel.saveCardStartStats(json);
		duel.currentState = json.currentState;
		duel.loadJSON(json);
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
					h: 20
				},
				fillColor: colors.card.armor
			};
			let healthDMGJSON = {
				bounds: {
					x: 0,
					y: 20,
					w: 100,
					h: 20
				},
				fillColor: colors.card.health
			};
			if(turn.letter === currentGame.playerLetter) {
				console.log('p->o');
				animations.card.playerAttackOpp(duel.playerCard.character,duel.oppCard.character,turn);
				animations.attack.attackNameSlide(duel.playerAttack,true);

				armorDMGJSON.text = json['card'+currentGame.oppLetter].armor-duel.oppCurrentCard.armor;
				healthDMGJSON.text = json['card'+currentGame.oppLetter].health-duel.oppCurrentCard.health;

				armorDMGJSON.parentSprite = duel.oppCard.character;
				healthDMGJSON.parentSprite = duel.oppCard.character;

			} else {
				console.log('o->p');
				animations.card.oppAttackPlayer(duel.oppCard.character,duel.playerCard.character,turn);
				animations.attack.attackNameSlide(duel.oppAttack,false);

				armorDMGJSON.text = json['card'+currentGame.oppLetter].armor-duel.oppCurrentCard.armor;
				healthDMGJSON.text = json['card'+currentGame.oppLetter].health-duel.oppCurrentCard.health;

				armorDMGJSON.parentSprite = duel.playerCard.character;
				healthDMGJSON.parentSprite = duel.playerCard.character;
			}
		}
		duel.currentState = json.currentState;
		duel.saveCardCurrentStats(json);
		duel.loadJSON(json);
	},
};