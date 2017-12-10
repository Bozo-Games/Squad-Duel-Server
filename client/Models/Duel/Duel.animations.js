animations.duel = {
	playerSelectsCard:function (card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			return new TranslationAnimation(-width, height/4, 0, 0, 800, callBack);
		}
		return undefined;
	},
	playerSwitchCard:function (card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			return [
				new ScaleAnimation(1,1,-1,-1,100, function (card) {
					card.loop = 'run';
					card.activeAnimations.concat(new TranslationAnimation( 0, 0,-width, height/4, 300, function (card) {
						card.loop = 'idle';
						callBack();
					}));
				})];
		}
		return undefined;
	},
};