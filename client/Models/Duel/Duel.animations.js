animations.duel = {
	playerSelectsCard:function (card,callBack) {
		if(currentGame.isPlayerCard(card.id)) {
			card.loop = ''
			return new TranslationAnimation(-defaults.card.selected.size.width(), height/4, 0, 0, 800, callBack);
		}
		return undefined;
	},
	playerSwitchCard:function (duel,card,callBack) {
		console.log(duel+' ,'+card);
		if(currentGame.isPlayerCard(card.id)) {
			let turnTime = 1000;
			let runTime = 10000;
			return [
				new TranslationAnimation(0,0,defaults.card.selected.size.width()/2,0,turnTime, function (card) {
					console.log('turn done 1/2');
				}),
				new ScaleAnimation(1,1,-1,1,turnTime, function (card) {
					console.log('turn done 2/2');
					console.log(duel + ' - ' + card);
					card.loop = 'run';
					card.activeAnimations = card.activeAnimations.concat(
						new TranslationAnimation(defaults.card.selected.size.width()/2,0,defaults.card.selected.size.width()/2,0,runTime,function (card) {}),
						new ScaleAnimation(-1,1,-1,1,runTime, function (card) {}),
						new TranslationAnimation( 0, 0,defaults.card.selected.size.width(), height/4, runTime, function (card) {
							console.log('run done 1/1');
							card.loop = 'idle';
							callBack(card);
					}));
				})];
		}
		return undefined;
	},
};