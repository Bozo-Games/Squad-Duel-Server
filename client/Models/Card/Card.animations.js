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
			} else if(card instanceof CardDuelCharacter && card.parentSprite instanceof CardDuelPlayer ) {
				card.loop = 'walk';
				let returnLoc = {
					x:card.parentSprite.bounds.w*defaults.card.duel.player.characterScale.x,
					y:card.parentSprite.bounds.h*defaults.card.duel.player.characterScale.y};

				card.scaleAnimation.forceUpdate({width: 1, height: 1});
				card.translationAnimation.forceUpdate({x: -card.bounds.w, y: card.bounds.h * 2});

				card.translationAnimation.appendKeyValue(new KeyValue({
					val:returnLoc,
					endEpoch: frameTime + 800,
					callBack: function (card) {
						card.currentState = 'selected';
						card.loop = 'idle';
						card.loadJSON(json);
						if(card.parentSprite instanceof CardDuelPlayer) {
							animations.button.lockIn.show(card.parentSprite.lockInBtn);
							animations.card.showStatBox(card.parentSprite.statsBox);
						}
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
	"selected->lockedIn": function (card, json) {
		if(currentGame.isPlayerCard(card.id)) {
			if (card.constructor.name === 'CardDuelCharacter') {
				card.loop = 'attack';
				card.scaleAnimation.appendKeyValue(new KeyValue({
					val:{width:1,height:0.8},
					endEpoch: frameTime+200,
					callBack: function (card) {
						card.scaleAnimation.appendKeyValue(new KeyValue({
							val:{width:1,height:1.1},
							endEpoch: frameTime+300,
							callBack: function (card) {
								card.scaleAnimation.appendKeyValue(new KeyValue({
									val:{width:1,height:1.1},
									endEpoch: frameTime+100,
									callBack: function (card) {
										card.scaleAnimation.appendKeyValue(new KeyValue({
											val:{width:1,height:1},
											endEpoch: frameTime+300,
											callBack: function (card) {
												card.loop = 'idle';
												card.currentState = 'lockedIn';
												card.loadJSON(json);
											}
										}));
									}
								}));
							}
						}));
					}
				}));
				//translations
				let orign = {x: card.translationAnimation.x,y:card.translationAnimation.y};
				card.translationAnimation.appendKeyValue(new KeyValue({
					val: {x: card.translationAnimation.x, y: card.bounds.h*0.2},
					endEpoch: frameTime + 200,
					callBack: function (card) {
						card.translationAnimation.appendKeyValue(new KeyValue({
							val: {x:  card.translationAnimation.x, y: -card.bounds.h*0.5},
							endEpoch: frameTime + 300,
							callBack: function (card) {
								card.translationAnimation.appendKeyValue(new KeyValue({
									val: {x:  card.translationAnimation.x, y: -card.bounds.h*0.5},
									endEpoch: frameTime + 50,
									callBack: function (card) {
										card.translationAnimation.appendKeyValue(new KeyValue({
											val: orign,
											endEpoch: frameTime + 300,
											callBack: function (card) {
												//do nothing scale is doing stuff
											}
										}));
									}
								}));
							}
						}));
					}
				}));
			} else if(card.constructor.name === 'CardDuelCharacter') {

			} else {
				card.currentState = 'lockedIn';
				card.loadJSON(json);
			}
		} else {
			card.currentState = 'lockedIn';
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
			} else if(card instanceof CardDuelPlayer) {
				animations.button.lockIn.hide(card.lockInBtn);
				animations.card.hideStatBox(card.statsBox);
				card.id = json.id;
				card.loadJSON(json);
			} else {
				card.id = json.id;
				card.loadJSON(json);
			}
		} else {
			card.id = json.id;
			card.loadJSON(json);
		}
	},
	oppEnter: function (card) {
		card.scaleAnimation.forceUpdate({width: 1, height: 1});
		card.translationAnimation.forceUpdate({x: card.parentSprite.orignalCharacterX+card.bounds.w, y: -card.bounds.h * 2});
		card.loop = 'walk';
		card.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x:card.parentSprite.orignalCharacterX,
				y:card.parentSprite.bounds.h*defaults.card.duel.opp.characterScale.y
			},
			endEpoch: frameTime + 1200,
			callBack:function (card) {
				card.loop = 'idle';
			}
		}));
	},
	hideStatBox: function (card) {
		card.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x:-card.bounds.w*1.3,
				y:card.translationAnimation.y
			},
			endEpoch: frameTime + 400,
			callBack:function (card) {}
		}));
	},
	showStatBox: function (card) {
		card.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x: card.parentSprite.bounds.w*defaults.card.duel.player.statBoxScale.x,
				y: card.parentSprite.bounds.h*defaults.card.duel.player.statBoxScale.y,
			},
			endEpoch: frameTime + 400,
			callBack:function (card) {}
		}));
	},
	oppAttackPlayer: function (attacker,defender,turn) {
		let rise = 1;
		let run = 1;
		let attackerOrgin = {x: attacker.translationAnimation.x, y: attacker.translationAnimation.y};
		attacker.loop = 'run';
		attacker.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x:attacker.bounds.w*run,
				y:attacker.bounds.h*rise
			},
			endEpoch: frameTime + 800,
			callBack: function (card) {
				attacker.loop = 'attack';
				defender.loop = 'block';
				attacker.translationAnimation.appendKeyValue(new KeyValue({
					val:{
						x:attacker.bounds.w*run,
						y:attacker.bounds.h*rise
					},
					endEpoch: frameTime + 600*turn.powerMultiplier,
					callBack: function (card) {
						attacker.loop = 'run';
						defender.loop = 'idle';
						attacker.scaleAnimation.appendKeyValue(new KeyValue({
							val: {width:-1, height:1},
							endEpoch: frameTime + 200,
							callBack: function (card) {
							}}));
						attacker.translationAnimation.appendKeyValue(new KeyValue({
							val: {
								x:attacker.translationAnimation.x,
								y:attacker.bounds.h*rise
							},
							endEpoch: frameTime + 200,
							callBack: function (card) {
								attacker.translationAnimation.appendKeyValue(new KeyValue({
									val: {
										x:attackerOrgin.x,
										y:attackerOrgin.y
									},
									endEpoch: frameTime + 800,
									callBack: function (card) {
										attacker.scaleAnimation.appendKeyValue(new KeyValue({
											val: {width:1, height:1},
											endEpoch: frameTime + 200,
											callBack: function (card) {

											}}));
										attacker.translationAnimation.appendKeyValue(new KeyValue({
											val: attackerOrgin,
											endEpoch: frameTime + 200,
											callBack: function (card) {
												card.loop = 'idle';
											}}));
									}}));
							}}));
					}}));
			}}));
	},
	playerAttackOpp: function (attacker,defender,turn) {
		let rise = -1;
		let run = 1;
		let attackerOrgin = {x: attacker.translationAnimation.x, y: attacker.translationAnimation.y};
		attacker.loop = 'run';
		attacker.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x:attacker.bounds.w*run,
				y:attacker.bounds.h*rise
			},
			endEpoch: frameTime + 800,
			callBack: function (card) {
				attacker.loop = 'attack';
				defender.loop = 'block';
				attacker.translationAnimation.appendKeyValue(new KeyValue({
					val:{
						x:attacker.bounds.w*run,
						y:attacker.bounds.h*rise
					},
					endEpoch: frameTime + 600*turn.powerMultiplier,
					callBack: function (card) {
						attacker.loop = 'run';
						defender.loop = 'idle';
						attacker.scaleAnimation.appendKeyValue(new KeyValue({
							val: {width:-1, height:1},
							endEpoch: frameTime + 200,
							callBack: function (card) {

							}}));
						attacker.translationAnimation.appendKeyValue(new KeyValue({
							val: {
								x:attacker.bounds.w*run*2,
								y:attacker.bounds.h*rise
							},
							endEpoch: frameTime + 200,
							callBack: function (card) {
								attacker.translationAnimation.appendKeyValue(new KeyValue({
									val: {
										x:attackerOrgin.x+card.bounds.w,
										y:attackerOrgin.y
									},
									endEpoch: frameTime + 800,
									callBack: function (card) {
										attacker.loop = 'idle';
										attacker.scaleAnimation.appendKeyValue(new KeyValue({
											val: {width:1, height:1},
											endEpoch: frameTime + 200,
											callBack: function (card) {

											}}));
										attacker.translationAnimation.appendKeyValue(new KeyValue({
											val: attackerOrgin,
											endEpoch: frameTime + 200,
											callBack: function (card) {

											}}));
									}}));
							}}));
					}}));
			}}));
	}

};