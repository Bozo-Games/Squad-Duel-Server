animations.duel = {
	playerSelectsCard:function (card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			return new TranslationAnimation(-width, height/4, 0, 0, 800, callBack);
		}
		return undefined;
	},
	playerSwitchCard:function (duel,card,callBack) {
		console.log(duel+' ,'+card);
		if(currentGame.isPlayerCard(card.id)) {
			let turnTime = 1000;
			let runTime = 1000;
			return [
				new TranslationAnimation(0,0,-defaults.card.selected.width(),0,1,turnTime, function () {}),
				new ScaleAnimation(1,1,-1,1,turnTime, function (card) {
					console.log(duel + ' - ' + card);
					card.loop = 'run';
					card.activeAnimations = card.activeAnimations.concat(
						new TranslationAnimation( 0, 0,-width, height/4, runTime, function (duel,card) {
							card.loop = 'idle';
					}));
				})];
		}
		return undefined;
	},
};