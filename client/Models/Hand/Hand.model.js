class Hand {
	constructor(json){
		json = json === undefined ? {} : json;
		this.cards = json.cards === undefined ? [] : json.cards;
		this.cards = [];
		for(let i = 0; i < json.cards.length;i++) {
			this.cards.push(new Card(json.cards[i]));
		}
	}
	loadJSON(json) {
		for(let i = 0; i < this.cards.length;i++) {
			this.cards[i].loadJSON(json.cards[i]);
		}
	}
	draw() {
		push();
		translate(defaults.hand.offset.x(),defaults.hand.offset.y());
		for(let i = 0; i < this.cards.length;i++) {
			this.cards[i].draw();
			translate(defaults.hand.step.x(),defaults.hand.step.y());
		}
		pop();
	}
}