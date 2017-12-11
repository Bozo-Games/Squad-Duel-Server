class Hand {
	constructor(json){
		json = json === undefined ? {} : json;
		this.cards = json.cards === undefined ? [] : json.cards;
		this.cards = [];
		json.cards = json.cards === undefined ? [] : json.cards;
		for(let i = 0; i < json.cards.length;i++) {
			this.cards.push(new Card(json.cards[i]));
		}
	}
	loadJSON(json) {
		json.cards = json.cards === undefined ? [] : json.cards;
		if(this.cards.length !== json.cards.length ) {
			this.cards = [];
			for(let i = 0; i < json.cards.length;i++) {
				this.cards.push(new Card(json.cards[i]));
			}
		} else {
			for (let i = 0; i < this.cards.length; i++) {
				this.cards[i].loadJSON(json.cards[i]);
			}
		}
	}
	touchEnded(){
		pushMouse();
		translateMouse(defaults.hand.offset.x(),defaults.hand.offset.y());
		for(let i = 0; i < this.cards.length;i++) {
			if(this.cards[i].shouldDrawHand){
				this.cards[i].touchEnded();
			}
			translateMouse(defaults.hand.step.x(),defaults.hand.step.y());
		}
		popMouse();
	}
	draw() {
		push();
		translate(defaults.hand.offset.x(),defaults.hand.offset.y());
		for(let i = 0; i < this.cards.length;i++) {
			if(this.cards[i].shouldDrawHand){
				this.cards[i].draw();
			}
			translate(defaults.hand.step.x(),defaults.hand.step.y());
		}
		pop();
	}
}