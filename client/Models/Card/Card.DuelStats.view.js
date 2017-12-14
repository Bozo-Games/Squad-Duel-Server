class CardDuelStats extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = colors.card.inHand.background;
		json.strokeWeight = 3;
		super(json);
	}

	draw() {
		push();
		super.applyAnimations();
		rect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h,5);
		//TODO draw stats
		super.drawSubViews();
		pop();
	}
}