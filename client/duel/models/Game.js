class Game {
	constructor(json) {
		json = json === undefined ? {} : json;
        let playerA = new Player(json.playerA);
        let handA = new Hand(json.handA);
        let playerB = new Player(json.playerB);
        let handB = new Hand(json.handB);

		if(playerA.isMe) {
            this.playerLetter = 'A';
            this.oppLetter = 'B';
			this.player = playerA;
			this.opp = playerB;
			this.playerHand = handA;
			this.oppHand = handB;
		} else if(playerB.isMe) {
            this.playerLetter = 'B';
            this.oppLetter = 'A';
            this.player = playerB;
            this.opp = playerA;
            this.playerHand = handB;
            this.oppHand = handA;
		} else { //implies is watcher
            this.playerLetter = 'A';
            this.oppLetter = 'B';
            this.player = playerA;
            this.opp = playerB;
            this.playerHand = handA;
            this.oppHand = handB;
		}
		this.playerHand.isPlayer = true;
		this.oppHand.isPlayer = false;


        this.duel = new Duel(json.duel);

		this.currentState = json.currentState === undefined ? 'new' : json.currentState;

	}
    mouseMoved() {
	    this.playerHand.mouseMoved();
        this.oppHand.mouseMoved();

	    this.duel.mouseMoved();
    }
	mouseReleased() {
		this.playerHand.mouseReleased();
		this.duel.mouseReleased();
	}
	
	draw(width,height) {

        this.duel.draw();
        this.playerHand.owner = 0;
        this.oppHand.owner = 1;
        this.playerHand.draw();
        this.oppHand.draw();

		push();
			translate(0,height*2/3);
			this.player.draw(width*0.8, height/3,true);
        	translate(width*0.1, height/3 * 0.1);
		pop();
        this.opp.draw();

		//debug drawing
        push();
        fill('#00ff00');
        textStyle(BOLD);
        textSize(17);
        text(this.currentState,width - textWidth(this.currentState) - 20,height / 2 - 10);
        pop();

	}

}