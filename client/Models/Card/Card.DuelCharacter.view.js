class CardDuelCharacter extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			//rect(this.global.x, this.global.y, this.global.h, this.global.h);
			let img = icons.getCharacter(this.name, this.loop);
			push();
			if(this.isOppCard) {
				if(this.animation.w > 0) {
					translate(this.local.w, 0);
				} else {
					translate(-this.local.w, 0);
				}
				scale(-1, 1);
			}
			image(img, 0,0, this.w, this.h);
			pop();
			this.drawSubSprites();
			pop();
		}
	}

	//-------------------------------------------------------------------------- animations
	stateChangeAnimation(from,to,json) {
		if(from === 'inHand' && to === 'selected' && this.isPlayerCard) {
			this._playerWalkIn(json);
			return false;
		} else if(from === 'selected' && to === 'lockedIn' && this.isPlayerCard) {
			this.jump(function (card) {
				card.currentState = 'lockedIn';
				card.loadJSON(json);
			},defaults.card.duelCharacter.animationTimes.jump);
			return false;
		} else {
			return super.stateChangeAnimation(from, to, json);
		}
	}
	swapCard(json) {
		if(this.currentState === 'selected' && this.isPlayerCard) {
			this.playerWalkOut(json);
			return false;
		} else {
			return super.swapCard(json);
		}
	}
	playerWalkOut(json) {
		this.loop = 'walk';
		let outLoc = {
			x: 0,
			y: this.global.y+this.h
		};
		if(this.isOppCard) {
			outLoc.x = width;
			outLoc.y = this.global.y - this.h;
		}
		this.flipHorizontally(function (card) {
			card.moveToGlobal(outLoc.x, outLoc.y, function (card) {
				card.flipHorizontally(function (card) {
					card.loop = 'idle';
					if(json !== undefined) {
						card.currentState = 'inHand';
						card.id = json.id;
						card.name = json.name; //this changes character drawn
						card.loadJSON(json);
					}
				},0);
			}, defaults.card.duelCharacter.animationTimes.walkOut); //walk time
		},defaults.card.duelCharacter.animationTimes.turn);//flip time
	}
	_playerWalkIn(json) {
		this.loop = 'walk';
		this.moveToLocal(0,0,function (card) {
			card.loop = 'idle';
			card.currentState = 'selected';
			if(json !== undefined) {
				card.loadJSON(json);
			}
		},defaults.card.duelCharacter.animationTimes.walkIn);
	}
	attackCharacter(defender,powerMultiplier,callBack) {
		this.loop = 'run';
		let offSet = 0.4;
		if(this.isPlayerCard) {
			offSet = -0.4;
		}
		this.moveToGlobal(defender.global.x+defender.w*offSet,defender.global.y,function (attacker) {
			attacker.loop = 'attack';
			defender.loop = 'block';
			attacker.holdAnimation(function (attacker) {
				attacker.loop = 'run';
				defender.loop = 'idle';
				attacker.flipHorizontally(function (attacker) {
					attacker.moveToLocal(attacker.root.w,0,function (attacker) {
						attacker.flipHorizontally(function (attacker) {
							attacker.loop = 'idle';
							if(typeof callBack === 'function') {
								callBack(attacker,defender);
							} else {
								console.log('cb = '+callBack);
							}
						},defaults.card.duelCharacter.animationTimes.turn);
					},defaults.card.duelCharacter.animationTimes.runToAttack);
				},defaults.card.duelCharacter.animationTimes.turn);
			},defaults.card.duelCharacter.animationTimes.attackHoldTimeRoot * powerMultiplier)
		},defaults.card.duelCharacter.animationTimes.runToAttack);
	}
	jump(callBack,time=2100) {
		this.loop = 'attack';
		this.push(new AnimationValue({
			x:this.animation.x,
			y:this.animation.y+this.h*0.2,
			w:1,
			h:0.8,
			time: time*0.1,
			callBack: function (card) {
				card.push(new AnimationValue({
					x:card.animation.x,
					y:card.animation.y-card.h/2 - card.h*0.2,
					w:1,
					h:1.1,
					time: time*0.35,
					callBack: function (card) {
						card.push(new AnimationValue({
							x: card.animation.x,
							y: card.animation.y,
							w: 1,
							h: 1,
							time: time * 0.1,
							callBack: function (card) {
								card.push(new AnimationValue({
									x: card.animation.x,
									y: card.animation.y+card.h/2+card.h*0.2,
									w: 1,
									h: 0.8,
									time: time * 0.35,
									callBack: function (card) {
										card.push(new AnimationValue({
											x: 0,
											y: 0,
											w: 1,
											h: 1,
											time: time * 0.1,
											callBack:function (card) {
												card.loop = 'idle';
												if(typeof  callBack === 'function') {
													callBack(card);
												}
											}}));
									}}));
							}}));
					}}));
			}}));
	}
}