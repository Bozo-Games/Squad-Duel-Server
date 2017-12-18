class CardDuelCharacter extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			//rect(this.bounds.x, this.bounds.y, this.bounds.h, this.bounds.h);
			let img = icons.getCharacter(this.name, this.loop);
			image(img, 0,0, this.w, this.h);
			this.drawSubSprites();
			pop();
		}
	}
}