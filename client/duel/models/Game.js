class Game {
	constructor(json) {
		this.json = json === undefined ? {} : json;
		this.playerHand = json.playerHand === undefined ? this.playerHand = new hand() : new hand(json.playerHand);
		this.oppHand = json.oppHand === undefined ? this.oppHand = new hand() : new hand(json.oppHand);
		this.duel = json.duel === undefined ? this.duel = new Duel() : new Duel(json.duel);
		//TODO factor out player into it's own class
		this.playerA = {name: "No Name", socketID: undefined};
        this.playerB = {name: "No Name", socketID: undefined};
	}

	draw() {
		this.playerHand.draw();
		this.oppHand.draw();
		this.duel.draw();

		let p = this.playerA.name;
		let o = this.playerB.name;
		if(this.playerB.socketID === socket.id) {
			p = this.playerB.name;
			o = this.playerA.name;
		}

		push();
        translate(20,480);
        text(p, 0, 0);
		pop();
		push();
        translate(20,20);
        text(o, 0, 0);
        pop();
	}

}