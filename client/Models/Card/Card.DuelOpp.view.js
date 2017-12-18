class CardDuelOpp extends  Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.touchEnabled = false;
		super(json);

	}
	show() {
		animations.card.oppCharacterEnters(this.character,function (card) {});
	}

	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			//this.character.draw();
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