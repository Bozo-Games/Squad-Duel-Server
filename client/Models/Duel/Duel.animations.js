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
	"waitingForCards->waitingForAttacks": function (duel,callBack) {
		if(duel.oppCard !== undefined) {
			duel.oppCard.loop = 'walk';
			duel.oppCard.activeAnimations = duel.oppCard.activeAnimations.concat(
				new TranslationAnimation(defaults.card.selected.size.width(), -height/4, 0, 0, 1200, function (deul) {
					duel.oppCard.loop = 'idle';
					callBack(duel);
				})
			);
			return undefined;
		}
		return undefined;
	},
	"waitingForAttacks->ready": function (duel,callBack) {
		let text3 = new FloatingText({
			color:'#ff0000',
			text:'3',
			offset: {x:width/2, y: height/2},
			halfLife:1050,
		}); //create 1 text
		text3.activeAnimations = text3.activeAnimations.concat(
			new FontSizeAnimation(height,height*0.2,1000,function (text) {
				let text2 = new FloatingText({
					color:'#ff7700',
					text:'2',
					offset:{x:width/2,y:height/2},
					halfLife:1050,
				}); //create 2 text
				text2.activeAnimations = text2.activeAnimations.concat(
					new FontSizeAnimation(height,height*0.2,1000,function (text) {
						let text1 = new FloatingText({
							color: '#77ff00',
							text: '1',
							offset: {x:width/2, y: height/2},
							halfLife: 1050,
						}); //create 1 text
						text1.activeAnimations = text1.activeAnimations.concat(
							new FontSizeAnimation(height,height*0.2,1000,function (text) {
								if(currentGame.iAmPrimaryPlayer) {
									network.processDuel();
								}
								callBack(duel);
							}) //end of text 1 animation
						);//add scale animation to text 1
						duel.floatingText = duel.floatingText.concat(
							text1
						); // add 1 floating text
					}) //end of 1 scale Animation
				); // end of 2 scale animation
				duel.floatingText = duel.floatingText.concat(
					text2
				); // add 2 floating text
			}) //end 3 scale animation
		);//add 3 scale animation to floating text 3
		duel.floatingText = duel.floatingText.concat(
			text3
		); //add 3 to duel floating text
		return new Animation(3000,function (duel) {});
	}
};