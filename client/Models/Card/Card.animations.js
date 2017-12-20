animations.card = {
	"inHand->selected": function (card, json) {
		if(card instanceof CardDuelCharacter) {
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
		if(card instanceof CardDuelCharacter) {
			if (currentGame.isPlayerCard(card.id)) {
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
			card.moveToLocal(0,0,function (card) {
				card.currentState = 'inHand';
				card.loadJSON(json);
			},400);
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
		if (card instanceof CardInHand) {
			card.loop = 'die';
			card.moveToLocal(0,0,function (card) {
				card.currentState = 'dead';
				card.loadJSON(json);
			},400);
		} else {
			card.currentState = 'dead';
			card.loadJSON(json);
		}

	},
	playerCharacterLeaves: function (card,callBack) {
		card.loop = 'walk';
		card.flipHorizontally(function (card) {
			card.moveToGlobal(0, height-card.h, function (card) {
				card.flipHorizontally(callBack,0);
			}, 800); //walk time
		},200);//flip time
	},

	oppCharacterLeaves: function (card,callBack) {
		card.loop = 'walk';
		card.flipHorizontally(function (card) {
			card.moveToGlobal(width+card.w, 0, function (card) {
				card.flipHorizontally(callBack,0);
			}, 800); //walk time
		},200);//flip time
	},

};