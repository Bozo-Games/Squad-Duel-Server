class hand {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.cards = json.cards === undefined ? 5 : json.cards; 
		this.owner = json.owner === undefined ? 0 : json.owner;
		if(json.cardsInHand === undefined) {
			this.cardsInHand = [];
			var defaultCardSize = 5;
			for(var i = 0; i < defaultCardSize; i++) {
				this.cardsInHand.push(new card());
			}
		} else {
			this.cardsInHand = [];
			for(var i = 0; i < json.cardsInHand.length; i++) {
				this.cardsInHand.push(new card(json.cardsInHand[i]));
			}
		}
	}

	draw() {
		var split = width/this.cards;
		var counter = this.cards;
		var xi, yi;
		var step = width / this.cardsInHand.length;
		push();
		if (this.owner == 0) {
			translate(50,500);
			xi = 50;
			yi = 500;
		}
		else {
			xi = 50;
			yi = 50;
			translate(50,50);
		}
		for (var i = 0; i < this.cardsInHand.length; i++) {
				this.cardsInHand[i].mouseHit = collidePointRect(mouseX,mouseY,xi,yi,55, 80, 3);
				this.cardsInHand[i].draw();
				translate(step,0);
				xi += step;
		}
		pop();
	}
}
