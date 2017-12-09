class Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.currentState = json.currentState;
		this.id = json.id;
	}
	loadJSON(json) {
		if(this.currentState !== json.currentState) {
			let animation = animations.card[`${this.currentState}->${json.currentState}`];
			if(animation !== undefined) {
				animation(this,function () {
					this.currentState = json.currentState;
					this.loadJSON(json);
				});
			} else {
				this.currentState = json.currentState;
				this.loadJSON(json);
			}
		} else {
			this.health = json.health;
			this.armor = json.armor;
			this.speed = json.speed;
		}
	}
	draw() {
		if(this.currentState === 'inHand') {
			this._inHandDraw();
		}
	}
	touchEnded(){
		if(this.currentState === 'inHand') {
			this._inHandTouchEnded();
		}
	}
	_inHandTouchEnded(){
		pushMouse();
		let didTap = collidePointRect(
			mouseX,mouseY,
			0,0,
			defaults.card.inHand.size.width(),
			defaults.card.inHand.size.height());
		if(didTap) {
			network.selectCard(this.id);
		}
		popMouse();
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