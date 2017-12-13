class CardInHand extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = json.fillColor === undefined ? colors.card.inHand.background : json.fillColor;
		super(json);
	}
	draw() {
		push();
			this.applyAnimations();
			ellipseMode(CORNER);
			//ellipse(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h);
			let img = icons.getCharacter(this.name,this.loop);
			image(img,
				this.bounds.x,this.bounds.y,this.bounds.w, this.bounds.h);
			this.drawSubViews();
		pop();
	}
}