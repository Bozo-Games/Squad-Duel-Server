class CardDuelCharacter extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.bounds = json.bounds === undefined ? {x:0,y:0,w:100,h:100} : json.bounds;
		super(json);
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyAnimations();
			if (currentGame.isOppCard(this.id)) {
				translate(this.bounds.w / 2, 0);
				scale(-1, 1);
			}
			rect(this.bounds.x, this.bounds.y, this.bounds.h, this.bounds.h);
			let img = icons.getCharacter(this.name, this.loop);
			image(img, this.bounds.x, this.bounds.y, this.bounds.h, this.bounds.h);
			this.drawSubViews();
			pop();
		}
	}
}