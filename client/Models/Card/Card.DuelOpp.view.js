class CardDuelOpp extends  Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.touchEnabled = false;
		super(json);
		let size = this.bounds.h*defaults.card.duel.player.characterScale.h;

		json.bounds = {
			x: this.bounds.w - size+this.bounds.w*defaults.card.duel.player.characterScale.x,
			y: this.bounds.h*defaults.card.duel.player.characterScale.y,
			w: size,
			h: size
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);
		//foce to hide until the right moment
		this.character.scaleAnimation.forceUpdate({width: 1, height: 1});
		this.character.translationAnimation.forceUpdate({
			x: this.character.bounds.w+this.character.bounds.x,
			y: -this.character.bounds.h * 2});
	}
	show() {
		animations.card.oppCharacterEnters(this.character,function (card) {});
	}

	draw() {
		if(this.id !== undefined) {
			push();
			this.applyAnimations();
			this.character.draw();
			//this.statsBox.draw();
			//this.lockInBtn.draw();

			this.subSprites.forEach(function (sprite) {
				if(sprite instanceof FloatingText) {
					sprite.draw();
				}
			});
			pop();
		}
	}
}