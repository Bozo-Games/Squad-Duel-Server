class Game {
	constructor(json) {
		this.json = json === undefined ? {} : json;
		this.playerHand = json.playerHand === undefined ? this.playerHand = new hand() : new hand(json.playerHand);
		this.oppHand = json.oppHand === undefined ? this.oppHand = new hand() : new hand(json.oppHand);
		this.duel = json.duel === undefined ? this.duel = new Duel() : new Duel(json.duel);
	}

	draw() {
		this.playerHand.draw();
		this.oppHand.draw();
		this.duel.draw();
	}

}