animations.duel = {
	playerSelectsCard:function (card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			card.loop = 'walk';
			return new TranslationAnimation(-defaults.card.selected.size.width(), height/4, 0, 0, 1200, function (card) {
				card.loop = 'idle';
				callBack(card);
			});
		}
		return undefined;
	},
	playerSwitchCard:function (duel,card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			let turnTime = 400;
			let runTime = 1000;
			return [
				new TranslationAnimation(0,0,defaults.card.selected.size.width(),0,turnTime, function (card) {}),
				new ScaleAnimation(1,1,-1,1,turnTime, function (card) {
					card.loop = 'run';
					card.activeAnimations = card.activeAnimations.concat(
						new TranslationAnimation(defaults.card.selected.size.width(),0,defaults.card.selected.size.width(),0,runTime,function (card) {}),
						new ScaleAnimation(-1,1,-1,1,runTime, function (card) {}),
						new TranslationAnimation( 0, 0,defaults.card.selected.size.width()+defaults.duel.playerCard.offset.x(), height/4, runTime, function (card) {
							card.loop = 'idle';
							callBack(card);
					}));
				})];
		}
		return undefined;
	},
};