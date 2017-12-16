class CardDuelCharacter extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.bounds = json.bounds === undefined ? {x:0,y:0,w:100,h:100} : json.bounds;
		super(json);
		if (currentGame.isOppCard(this.id)) {
			animations.card.flipCharacterHorizonaly(this,function (card) {
			},10);
		}
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyAnimations();
			//rect(this.bounds.x, this.bounds.y, this.bounds.h, this.bounds.h);
			let img = icons.getCharacter(this.name, this.loop);
			image(img, 0,0, this.bounds.w, this.bounds.h);
			this.drawSubViews();
			pop();
		}
	}
}