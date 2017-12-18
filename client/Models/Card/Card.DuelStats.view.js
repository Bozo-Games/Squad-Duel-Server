class CardDuelStats extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.color = colors.card.inHand.background;
		json.strokeWeight = 3;
		super(json);
	}

	draw() {
		push();
		super.applyTransformations();
		rect(0,0,this.bounds.w,this.bounds.h,5);

		let iconSize = this.bounds.h / 5;
		let y = (iconSize)/5;
		let step = iconSize + y;
		fill(colors.card.text);
		textSize(iconSize*0.8);
		strokeWeight(1);
		textAlign(LEFT,TOP);
		['health','armor','speed','power'].forEach(function (stat) {
			tint(colors.card[stat]);
			image(icons.card[stat],(this.bounds.w*0.5-iconSize)/2,y,iconSize,iconSize);
			text(this[stat],this.bounds.w*0.55,y);
			y += step;
		}.bind(this));
		super.drawSubSprites();
		pop();
	}
}