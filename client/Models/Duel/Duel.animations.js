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
					}) //end of 1 scale p5+
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
	},
	"ready->newAttack": function (duel,callBack) {
		if(currentGame.iAmPrimaryPlayer) {
			network.processDuel();
		}
		return undefined;
	},
	"attackFinished->waitingForCards": function (duel,callBack) {
		return animations.duel["displayResults->waitingForCards"](duel,callBack);
	},
	"displayResults->waitingForCards": function (duel,callBack) {
		duel.playerCard = undefined;
		duel.oppCard = undefined;
		duel.playerAttack = undefined;
		duel.oppAttack = undefined;
		savePlayerCardStartJSON = undefined;
		saveOppCardStartJSON = undefined;
		return undefined;
	},
	"attackFinished->newAttack": function (duel,callBack) {
		if(currentGame.iAmPrimaryPlayer) {
			network.processDuel();
		}
		return undefined;
	},
	"newAttack->attackFinished": function (duel,callBack) {
		let attackerText = new FloatingText({
			color:'#000000',
			text:'!',
			offset:{x:0,y:0},
			halfLife:1500,
			size: 30
		});
		let attackingCard = duel[duel.attacker+'Card'];
		let defendingCard = duel[duel.defender+'Card'];

		let xOff = defaults.card.selected.size.width();
		let yOff = height/5;
		if(duel.attacker === 'player') {
			yOff = -1*yOff;
			xOff = 1*xOff;
		} else {
			xOff = -1*xOff;

		}
		attackingCard.loop = 'run';
		attackingCard.floatingText = attackingCard.floatingText.concat(attackerText);
		attackingCard.activeAnimations = attackingCard.activeAnimations.concat(
			new TranslationAnimation(0,0,xOff,yOff,1000,function (card) {
				card.loop = 'attack';
				defendingCard.loop = 'block';
				card.activeAnimations = card.activeAnimations.concat(
					new TranslationAnimation(xOff,yOff,xOff,yOff,2000,function (card) {
						card.loop = 'run';
						defendingCard.loop = 'idle';
						card.activeAnimations = card.activeAnimations.concat(
							new TranslationAnimation(0,0,defaults.card.selected.size.width(),0,200,function (card) {}),
							new TranslationAnimation(xOff,yOff,xOff,yOff,200,function (card) {}),
							new ScaleAnimation(1,1,-1,1,200,function (card) {
								card.activeAnimations = card.activeAnimations.concat(
									new TranslationAnimation(defaults.card.selected.size.width(),0,defaults.card.selected.size.width(),0,2000,function (card) {}),
									new ScaleAnimation(-1,1,-1,1,2000,function (card) {}),
									new TranslationAnimation(-xOff,yOff,0,0,2000,function (card) {
										card.loop = 'idle';
										card.activeAnimations = card.activeAnimations.concat(
											new TranslationAnimation(defaults.card.selected.size.width(),0,0,0,200,function (card) {}),
											new ScaleAnimation(-1,1,1,1,200,function (card) {
												if(currentGame.iAmPrimaryPlayer) {
													network.processDuel();
												}
												callBack(duel);
											})
										);
									})
								)
							})
						);
					})
				)
			})
		);
		return new Animation(1500,function (duel) {});
	}
};