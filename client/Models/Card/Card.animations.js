animations.card = {
	"inHand->selected": function (card, json) {
		if (card.constructor.name === 'CardInHand' && currentGame.isPlayerCard(card.id)) {
			card.translationAnimation.appendKeyValue(new KeyValue({
				val: {x: 0, y: card.bounds.h*2.2},
				endEpoch: frameTime + 400,
				callBack: function (card) {
					card.currentState = 'selected';
					card.loadJSON(json);
				}
			}));
		}
	},
	"selected->inHand": function (card, json) {
		if (card.constructor.name === 'CardInHand' && currentGame.isPlayerCard(card.id)) {
			card.translationAnimation.appendKeyValue(new KeyValue({
				val: {x: 0, y:0},
				endEpoch: frameTime + 400,
				callBack: function (card) {
					card.currentState = 'inHand';
					card.loadJSON(json);
				}
			}));
		}
	}

};