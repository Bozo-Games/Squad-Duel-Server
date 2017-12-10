class Hand {
	constructor(json){
		json = json === undefined ? {} : json;
		this.cards = json.cards === undefined ? [] : json.cards;
		this.cards = [];
		json.cards = json.cards === undefined ? [] : json.cards
		for(let i = 0; i < json.cards.length;i++) {
			this.cards.push(new Card(json.cards[i]));
		}
	}
	loadJSON(json) {
		for(let i = 0; i < this.cards.length;i++) {
			this.cards[i].loadJSON(json.cards[i]);
		}
	}
	touchEnded(){
		pushMouse();
		translateMouse(defaults.hand.offset.x(),defaults.hand.offset.y());
		for(let i = 0; i < this.cards.length;i++) {
			if(this.cards[i].currentState === 'inHand' || (this.cards[i].currentState === 'selected' && !currentGame.isPlayerCard(this.cards[i].id))){
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
			if(this.cards[i].currentState === 'inHand' || (this.cards[i].currentState === 'selected' && !currentGame.isPlayerCard(this.cards[i].id))){
				this.cards[i].draw();
			}
			translate(defaults.hand.step.x(),defaults.hand.step.y());
		}
		pop();
	}
}