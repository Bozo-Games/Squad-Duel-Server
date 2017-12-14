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
};