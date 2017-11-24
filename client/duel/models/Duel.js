class Duel {
		constructor(json) {
		json = json === undefined ? {} : json;
        this.cardSelected = json.cardSelected === undefined ? 0 : new card(cardFromHand);
        //new card(json.cardsInHand[i])

		this.mouseHit = false;
	}


	draw() {
		//rect(0, 0, 666, 666, 3); // draw card

		/*
		var statHealth = "Health: " + this.health;
		var statArmor = "Armor: " + this.armor;
		var statSpeed = "Speed: " + this.speed;
		var statAttack = "Attack 1";
		var statAttack2 = "Attack 2";
		
		push();	



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
		pop();*/
	}
}