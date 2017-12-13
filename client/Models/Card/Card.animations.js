animations.card = {
	"inHand->selected": function (card, json) {
		if(currentGame.isPlayerCard(card.id)) {
			if (card.constructor.name === 'CardInHand') {
				card.translationAnimation.appendKeyValue(new KeyValue({
					val: {x: 0, y: card.bounds.h * 2.2},
					endEpoch: frameTime + 400,
					callBack: function (card) {
						card.currentState = 'selected';
						card.loadJSON(json);
					}
				}));
			} else if(card.constructor.name === 'CardDuelCharacter') {
				card.loop = 'walk';
				let returnLoc = {
					x:card.parentSprite.bounds.w*defaults.card.duel.player.characterScale.x,
					y:card.parentSprite.bounds.h*defaults.card.duel.player.characterScale.y};
				console.log(JSON.stringify(returnLoc));
				card.scaleAnimation.forceUpdate({width:1,height:1});
				card.translationAnimation.forceUpdate({x:-card.bounds.w,y:card.bounds.h*2});
				card.translationAnimation.appendKeyValue(new KeyValue({
					val:returnLoc,
					endEpoch: frameTime + 800,
					callBack: function (card) {
						card.currentState = 'selected';
						card.loop = 'idle';
						card.loadJSON(json);
					}
				}));
			} else {
				card.currentState = 'selected';
				card.loadJSON(json);
			}
		} else {
			card.currentState = 'selected';
			card.loadJSON(json);
		}
	},
	"selected->inHand": function (card, json) {
		if(currentGame.isPlayerCard(card.id)) {
			if (card.constructor.name === 'CardInHand') {
				card.translationAnimation.appendKeyValue(new KeyValue({
					val: {x: 0, y: 0},
					endEpoch: frameTime + 400,
					callBack: function (card) {
						card.currentState = 'inHand';
						card.loadJSON(json);
					}
				}));
			} else {
				card.currentState = 'inHand';
				card.loadJSON(json);
			}
		} else {
			card.currentState = 'inHand';
			card.loadJSON(json);
		}
	},
	swapCard: function (card,json) {
		if(currentGame.isPlayerCard(card.id)) {
			if(card.constructor.name === 'CardDuelCharacter') {
				card.translationAnimation.appendKeyValue(new KeyValue({
					val: {x: card.bounds.w + card.translationAnimation.x, y: card.translationAnimation.y},
					endEpoch: frameTime + 300,
					callBack: function (card) {
						//do nothing other animations are working
					}
				}));
				card.scaleAnimation.appendKeyValue(new KeyValue({
					val:{width:-1,height:1},
					endEpoch: frameTime + 300,
					callBack:function (card) {
						card.loop = 'walk';
						card.translationAnimation.appendKeyValue(new KeyValue({
							val: {x: card.bounds.w-card.translationAnimation.x, y: card.bounds.h * 2},
							endEpoch: frameTime + 800,
							callBack: function (card) {
								card.id = json.id;
								card.loadJSON(json);
								card.currentState = 'inHand';
								card.loadJSON(json);
							} //end move away callback
						})); //end add move away animation add
					} //end turn callback
				})); //end scale animation
			} else {
				card.id = json.id;
				card.loadJSON(json);
			}
		} else {
			card.id = json.id;
			card.loadJSON(json);
		}
	}

};