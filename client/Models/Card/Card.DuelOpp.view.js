class CardDuelOpp extends  Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.touchEnabled = false;
		super(json);
		let size = this.bounds.h*defaults.card.duel.opp.characterScale.h;
		json.bounds = {
			x: this.orignalCharacterX,
			y: this.bounds.h*defaults.card.duel.opp.characterScale.y,
			w: size,
			h: size
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);
		//foce to hide until the right moment
		this.character.scaleAnimation.forceUpdate({width: 1, height: 1});
		this.character.translationAnimation.forceUpdate({x: this.character.bounds.w, y: -this.character.bounds.h * 2});
	}
	show() {
		animations.card.oppEnter(this.character);
	}
	get orignalCharacterX() {
		let size = this.bounds.h*defaults.card.duel.opp.characterScale.h;
		return  this.bounds.w - size + this.bounds.w*defaults.card.duel.player.characterScale.x
	}

	draw() {
		if(this.id !== undefined) {
			push();
			this.applyAnimations();
			this.character.draw();
			//this.statsBox.draw();
			//this.lockInBtn.draw();
			/*
			this.attacks.forEach(function (attack) {
				attack.draw();
			});*/
			pop();
		}
	}
}