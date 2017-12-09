animations.card = {
	"inHand->selected": function (card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			return new TranslationAnimation(0, 0, 0, defaults.card.inHand.size.height() * 1.1, 400, callBack);
		}
		return undefined;
	}
};