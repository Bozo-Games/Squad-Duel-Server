animations.card = {
	"inHand->selected": function (card, json) {
		if(card instanceof CardInHand) {
			if(currentGame.isPlayerCard(card.id)) {
				card.moveToGlobal(card.bounds.x,height,function (card) {
					card.currentState = 'selected';
					card.loadJSON(json);
				},400);
			} else {
				card.currentState = 'selected';
				card.loadJSON(json);
			}
		} else if(card instanceof CardDuelCharacter) {
			if(currentGame.isPlayerCard(card.id)) {
				card.loop = 'walk';
				card.moveToLocal(0,0,function (card) {
					card.loop = 'idle';
					card.currentState = 'selected';
					card.loadJSON(json);
				},800);
			} else {
				card.currentState = 'selected';
				card.loadJSON(json);
			}
		} else if(card instanceof CardDuelStats) {
			if(currentGame.isPlayerCard(card.id)) {
				card.moveToLocal(0,0,function (card) {
					card.currentState = 'selected';
					card.loadJSON(json);
				},800);
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
		if(card instanceof CardInHand) {
			card.moveToLocal(0,0,function (card) {
				card.currentState = 'inHand';
				card.loadJSON(json);
			},400);
		} else if(card instanceof CardDuelCharacter) {
			if (currentGame.isPlayerCard(card.id)) {
				card.loop = 'walk';
				card.flipHorizontally(function (card) {
					card.moveToGlobal(0, height-card.h, function (card) {
						console.log(frameTime +' move done');
						card.flipHorizontally(function (card) {
							card.loop = 'idle';
							card.currentState = 'inHand';
							card.id = json.id;
							card.name = json.name; //this changes character drawn
							console.log(frameTime + ' done move Out ' +JSON.stringify(card.animation));
							card.loadJSON(json);
						},0);
					}, 800); //walk time
				},200);//flip time
			} else {
				card.currentState = 'inHand';
				card.loadJSON(json);
			}
		} else if(card instanceof CardDuelStats) {
			console.log('here');
			if(currentGame.isPlayerCard(card.id)) {
				card.moveToGlobal(-card.w,card.bounds.y,function (card) {
					card.currentState = 'inHand';
					card.id = json.id;
					card.speed = json.speed;
					card.health = json.health;
					card.armor = json.armor;
					card.power = json.power;
					card.loadJSON(json);
				},1000);
			} else {
				card.currentState = 'selected';
				card.loadJSON(json);
			}
		} else {
			card.currentState = 'inHand';
			card.loadJSON(json);
		}
	},
	"dueling->inHand": function (card, json) {
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
	},
	"selected->lockedIn": function (card, json) {
		if (currentGame.isPlayerCard(card.id)) {
			if (card.constructor.name === 'CardDuelCharacter') {
				animations.card.characterJump(card, function (card) {
					card.currentState = 'lockedIn';
					card.loadJSON(json);
				});
			} else if (card.constructor.name === 'CardDuelCharacter') {

			} else {
				card.currentState = 'lockedIn';
				card.loadJSON(json);
			}
		} else {
			card.currentState = 'lockedIn';
			card.loadJSON(json);
		}
	}
	,
	"dueling->dead": function (card, json) {
		if(currentGame.isPlayerCard(card.id)) {
			if (card instanceof CardInHand) {
				card.loop = 'die';
				card.translationAnimation.appendKeyValue(new KeyValue({
					val: {x: 0, y: 0},
					endEpoch: frameTime + 400,
					callBack: function (card) {
						card.currentState = 'dead';
						card.loadJSON(json);
					}
				}));
			} else {
				card.currentState = 'dead';
				card.loadJSON(json);
			}
		} else {
			card.currentState = 'dead';
			card.loadJSON(json);
		}
	},

	swapCard: function (card,json) {
		if(card instanceof CardDuelCharacter) {
			if(currentGame.isPlayerCard(card.id)) {
				animations.card["selected->inHand"](card,json);
			} else {
				card.id = json.id;
				card.loadJSON(json);
			}
		}if(card instanceof CardDuelStats) {
			if(currentGame.isPlayerCard(card.id)) {
				animations.card["selected->inHand"](card,json);
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