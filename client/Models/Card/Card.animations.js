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
				animations.card.playerCharacterEnters(card,function (card) {
					card.currentState = 'selected';
					card.loadJSON(json);
					if(card.parentSprite instanceof CardDuelPlayer) {
						animations.button.lockIn.show(card.parentSprite.lockInBtn);
						animations.card.showStatBox(card.parentSprite.statsBox);
					}
				})
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
	"dueling->inHand": function (card, json) {
		if(currentGame.isPlayerCard(card.id)) {
			if (card instanceof CardInHand) {
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
				animations.card.characterJump(card,function (card) {
					card.currentState = 'lockedIn';
					card.loadJSON(json);
				});
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
	hideStatBox: function (card) {
		card.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x:-card.bounds.w*1.3,
				y:0
			},
			endEpoch: frameTime + 400,
			callBack:function (card) {}
		}));
	},
	showStatBox: function (card) {
		card.translationAnimation.appendKeyValue(new KeyValue({
			val: {
				x: 0,
				y: 0,
			},
			endEpoch: frameTime + 400,
			callBack:function (card) {}
		}));
	},
	characterAttackCharacter(attacker,defender,turn,rise,run,callBack) {
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

						animationDebug = function () {
							animations.card.flipCharacterHorizonaly(attacker,function (card) {
								attacker.translationAnimation.appendKeyValue(new KeyValue({
									val:{
										x:attackerOrgin.x+attacker.bounds.w*-1*(rise/Math.abs(rise)),
										y:attackerOrgin.y
									},
									endEpoch:frameTime+800,
									callBack: function (card) {
										animations.card.flipCharacterHorizonaly(attacker,function (card) {
											attacker.loop = 'idle';
											if(typeof callBack === 'function') {
												callBack(attacker,defender);
											}
										});
									}}));
							});
						};
						animationDebug();
					}}));
			}}));
	},
	oppAttackPlayer: function (attacker,defender,turn,callBack) {
		let rise = 1;
		let run = -0.1;
		animations.card.characterAttackCharacter(attacker,defender,turn,rise,run,callBack);
	},
	playerAttackOpp: function (attacker,defender,turn,callBack) {
		let rise = -1;
		let run = 0.6;
		animations.card.characterAttackCharacter(attacker,defender,turn,rise,run,callBack);
	},
	flipCharacterHorizonaly: function (card,callBack,time=200) {
		let dir = -1;
		let x = 1;
		if(card.scaleAnimation.width < 0) {
			dir = 1;
			x = -1;
		}
		card.scaleAnimation.appendKeyValue(new KeyValue({
			val:{width:dir,height:1},
			endEpoch: frameTime+time,
			callBack:callBack
		}));
		card.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:card.translationAnimation.x+card.bounds.w*x ,y:card.translationAnimation.y},
			endEpoch: frameTime+time,
			callBack:function (card) {}
		}));
	},
	playerCharacterEnters: function (card,callBack) {
		card.loop = 'walk';
		card.scaleAnimation.forceUpdate({width: 1, height: 1});
		card.translationAnimation.forceUpdate({x: -card.bounds.w-card.bounds.x, y: card.bounds.h * 2});
		card.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:0,y:0},
			endEpoch: frameTime + 800,
			callBack: function (card) {
				card.loop = 'idle';
				callBack(card);
			}
		}));
	},
	playerCharacterLeaves: function (card,callBack) {
		card.loop = 'walk';
		card.scaleAnimation.forceUpdate({width: 1, height: 1});
		card.translationAnimation.forceUpdate({x:0,y:0});
		animations.card.flipCharacterHorizonaly(card,function(card){
			card.translationAnimation.appendKeyValue(new KeyValue({
				val:{x: -card.bounds.w-card.bounds.x, y: card.bounds.h * 2},
				endEpoch:frameTime + 800,
				callBack:function(card){
					card.loop = 'idle';
					callBack(card);
				}
			}));
		});
	},

	oppCharacterLeaves: function (card,callBack) {
		card.loop = 'walk';
		card.scaleAnimation.forceUpdate({width: -1, height: 1});
		card.translationAnimation.forceUpdate({x:card.bounds.w/2,y:0});
		animations.card.flipCharacterHorizonaly(card,function(card){
			card.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x: card.bounds.w+card.bounds.x,
					y: -card.bounds.h * 2
				},
				endEpoch:frameTime + 800,
				callBack:function(card){
					card.loop = 'idle';
					callBack(card);
				}
			}));
		});
	},
	oppCharacterEnters: function (card,callBack) {
		card.loop = 'walk';
		card.scaleAnimation.forceUpdate({width: -1, height: 1});
		card.translationAnimation.forceUpdate({
			x: card.bounds.w+card.bounds.x,
			y: -card.bounds.h * 2});
		card.translationAnimation.appendKeyValue(new KeyValue({
			val:{x:card.bounds.w/2,y:0},
			endEpoch: frameTime + 800,
			callBack: function (card) {
				card.loop = 'idle';
				callBack(card);
			}
		}));
	},
	characterJump: function (card,callBack) {
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
										callBack(card);
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
	}

};