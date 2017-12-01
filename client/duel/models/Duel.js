class Duel {
    constructor(json) {
		console.log(json);
		json = json === undefined ? {} : json;
        //new card(json.cardsInHand[i])
        if(game !== undefined) {
        	this.cardSelected = json['card'+game.playerLetter] === undefined ? undefined : new Card(json['card'+game.playerLetter] );
            this.oopSelectedCard
    	}
		this.mouseHit = false;
	}
    mouseMoved() {
        if (this.cardSelected !== undefined) {
            let xi = (width - this.cardSelected.cardWidth * 2) / 2;
            let yi =  (height - this.cardSelected.cardHeight) / 2;
            this.cardSelected.mouseMoved(xi,yi,false);
        }
    }
	draw() {
		push();

		if (this.cardSelected !== undefined) {
            translate((width-this.cardSelected.cardWidth*2)/2, (height-this.cardSelected.cardHeight)/2);
			this.cardSelected.duelDraw();
		}
		//rect(0, 0, 666, 666, 3); // draw card

		/*
		var statHealth = "Health: " + this.health;
		var statArmor = "Armor: " + this.armor;
		var statSpeed = "Speed: " + this.speed;
		var statAttack = "Attack 1";
		var statAttack2 = "Attack 2";
		


		rect(0, 0, 55, 80, 3); // draw card
		translate(4,16);
		text(statHealth, 0, 0); 
		translate(0,14);
		text(statArmor,0,0);
		translate(0,14);
		text(statSpeed,0,0);
		rect(-2, 9, 50, 12, 1);
		translate(0,20);
		text(statAttack,0,0);
		rect(-2, 3, 50, 12, 1);
		translate(0,14);
		text(statAttack2,0,0);		
		*/
		pop();
	}
}