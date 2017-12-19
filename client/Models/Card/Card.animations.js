animations.card = {
	"inHand->selected": function (card, json) {
		if(card instanceof CardInHand) {
			if(currentGame.isPlayerCard(card.id)) {
				card.moveToGlobal(card.global.x,height,function (card) {
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
				card.show(function (card) {
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
			if(currentGame.isPlayerCard(card.id)) {
				card.hide(function (card) {
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
			if (card instanceof CardDuelCharacter) {
				card.jump(function (card) {
					card.currentState = 'lockedIn';
					card.loadJSON(json);
				},1200);
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
	characterAttackCharacter(attacker,defender,turn,rise,run,callBack) {
		attacker.debug = true;
		attacker.loop = 'run';
		attacker.moveToGlobal(defender.global.x - run*defender.w,defender.global.y,function (attacker) {
			attacker.loop = 'attack';
			attacker.push(new AnimationValue({
				x: attacker.animation.x,
				y: attacker.animation.y,
				w: attacker.animation.w,
				time: 300*turn.powerMultiplier,
				callBack: function (attacker) {
					attacker.loop = 'run';
					attacker.flipHorizontally(function(attacker){
						attacker.moveToLocal(rise*attacker.w,0,function(attacker){
							attacker.flipHorizontally(function (attacker) {
								attacker.loop = 'idle';
								callBack(attacker);
								console.log(JSON.stringify(attacker.animation));
							},200);
						},800);//run Back*/
					},200); //turn
				}}));//hold
		},800); //move to global
	},
	oppAttackPlayer: function (attacker,defender,turn,callBack) {
		let rise = 0;
		let run = -2.4;
		animations.card.characterAttackCharacter(attacker,defender,turn,rise,run,callBack);
	},
	playerAttackOpp: function (attacker,defender,turn,callBack) {
		let rise = 1;
		let run = 1.4;
		animations.card.characterAttackCharacter(attacker,defender,turn,rise,run,callBack);
	},
	playerCharacterLeaves: function (card,callBack) {
		card.loop = 'walk';
		card.scaleAnimation.forceUpdate({width: 1, height: 1});
		card.translationAnimation.forceUpdate({x:0,y:0});
		animations.card.flipCharacterHorizonaly(card,function(card){
			card.translationAnimation.appendKeyValue(new KeyValue({
				val:{x: -card.global.w-card.global.x, y: card.global.h * 2},
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
		card.translationAnimation.forceUpdate({x:card.global.w/2,y:0});
		animations.card.flipCharacterHorizonaly(card,function(card){
			card.translationAnimation.appendKeyValue(new KeyValue({
				val:{
					x: card.global.w+card.global.x,
					y: -card.global.h * 2
				},
				endEpoch:frameTime + 800,
				callBack:function(card){
					card.loop = 'idle';
					callBack(card);
				}
			}));
		});
	},

};