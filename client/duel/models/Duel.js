class Duel {
    constructor(json) {
		console.log(json);
		json = json === undefined ? {} : json;
        //new card(json.cardsInHand[i])
        if(game !== undefined) {
	        this.playerSelectedCard = json['card'+game.playerLetter] === undefined ? undefined : new Card(json['card'+game.playerLetter] );
	        this.oppSelectedCard = json['card'+game.oppLetter] === undefined ? undefined : new Card(json['card'+game.oppLetter] );
	        this.playerSelectedAttack = json['attack'+game.playerLetter] === undefined ? undefined : new Attack(json['attack'+game.playerLetter] );
	        this.oppSelectedAttack = json['attack'+game.oppLetter] === undefined ? undefined : new Attack(json['attack'+game.oppLetter] );
	        if(this.playerSelectedAttack !== undefined) {
	        	for(let i = 0; i < this.playerSelectedCard.attacks.length; i++) {
	        		if(this.playerSelectedCard.attacks[i].id === this.playerSelectedAttack.id) {
				        this.playerSelectedCard.attacks[i].isSelected = true;
			        }
		        }
	        }
	        if(this.oppSelectedAttack !== undefined) {
		        for(let i = 0; i < this.oppSelectedCard.attacks.length; i++) {
			        if(this.oppSelectedCard.attacks[i].id === this.oppSelectedAttack.id) {
				        this.oppSelectedCard.attacks[i].isSelected = true;
			        }
		        }
	        }
    	}
		this.mouseOver = false;

	}
	get isCombateRdy() {
    	return this.playerSelectedAttack !== undefined && this.oppSelectedAttack !== undefined;
	}
    mouseMoved() {
    	if(this.isCombateRdy) {
		    this.mouseOver = collidePointRect(mouseX,mouseY,width/2-25,height/2-25,50,50);
	    } else {
		    if (this.playerSelectedCard !== undefined) {
			    let xi = (width - this.playerSelectedCard.cardWidth * 2) / 2;
			    let yi = (height - this.playerSelectedCard.cardHeight) / 2;
			    this.playerSelectedCard.mouseMoved(xi, yi, false);
		    }
	    }
    }
    mouseReleased() {
	    if(this.isCombateRdy) {
			if(collidePointRect(mouseX,mouseY,width/2-25,height/2-25,50,50)) {
				network.processDuel();
			}
	    } else {
		    if (this.playerSelectedCard !== undefined) {
			    let xi = (width - this.playerSelectedCard.cardWidth * 2) / 2;
			    let yi = (height - this.playerSelectedCard.cardHeight) / 2;
			    this.playerSelectedCard.mouseReleased(xi, yi, false);
		    }
	    }
    }
	draw() {
		push();

		if(this.isCombateRdy) {
			push();
			fill('#ffff00');
			if(this.mouseOver) {
				fill('#00ff00');
			}
			rect(width/2-25,height/2-25,50,50,5);
			pop();
			translate((width - this.playerSelectedCard.cardWidth * 5) / 2, (height - this.playerSelectedCard.cardHeight*0.85) / 2 );
			this.playerSelectedCard.duelDraw();
			translate(this.playerSelectedCard.cardWidth * 3,-this.playerSelectedCard.cardHeight*0.15);
			this.oppSelectedCard.duelDraw();
		} else {
			if (this.playerSelectedCard !== undefined) {
				translate((width - this.playerSelectedCard.cardWidth * 2) / 2, (height - this.playerSelectedCard.cardHeight) / 2);
				this.playerSelectedCard.duelDraw();
			}
		}
		pop();
	}
}