class Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.currentState = json.currentState;
	}
	loadJSON(json) {

	}
	draw() {
		if(this.currentState === 'inHand') {
			this._inHandDraw();
		}
	}
	_inHandDraw() {
		push();
		fill(colors.card.inHand.background);
		ellipseMode(CORNER);
		ellipse(
			0,
			0,
			defaults.card.inHand.size.width(),
			defaults.card.inHand.size.height());
		pop();
	}
}