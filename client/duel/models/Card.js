class Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.id = json.id;
		this.name = json.name === undefined ? 'Ananymous' : json.name;
		this.health = json.health === undefined ? 0 : json.health;
		this.armor = json.armor === undefined ? 0 : json.armor;
		this.speed = json.speed === undefined ? 0 : json.speed;
		this.icon = json.icon === undefined ? 0 : json.icon;

		this.currentState = json.currentState === undefined ? 'Unknown State': json.currentState;

		this.attacks = [];
		for(let i = 0; i < json.attacks.length; i++) {
			let attack = new Attack(json.attacks[i]);
			this.attacks.push(attack);
		}
    }
    getRect(xi,yi) {
		let w = 100;
		let h = 100;
		if(this.currentState === 'inHandA' || this.currentState === 'inHandB' || this.currentState === 'selected'+game.oppLetter) {
			w = defaults.drawing.card.hand.width();
			h = defaults.drawing.card.hand.height();
			if(this.mouseIsOver) {
				xi -= (defaults.drawing.card.hand.width() * defaults.drawing.card.hand.mouseIsOverScale - defaults.drawing.card.hand.width())/2;
				if(this.currentState === 'inHand'+game.playerLetter) {
					yi -= (defaults.drawing.card.hand.height() * defaults.drawing.card.hand.mouseIsOverScale - defaults.drawing.card.hand.height());
				}
				w = w * defaults.drawing.card.hand.mouseIsOverScale;
				h = h * defaults.drawing.card.hand.mouseIsOverScale;
			}
		} else {}
		return {x:xi,y:yi,w:w,h:h};
    }
	//draw
	draw(xi,yi) {
		push(); //card
		let cardRect = this.getRect(xi,yi);
		translate(cardRect.x - xi,cardRect.y - yi);
		if(this.currentState === 'inHandA' || this.currentState === 'inHandB' || this.currentState === 'selected'+game.oppLetter) {
			this.handDraw(cardRect);
		}
		pop(); //card
	}

	//mouse events
    mouseMoved(xi,yi,isInHand) {
		let rect = this.getRect(xi,yi);
	    this.mouseIsOver = collidePointRect(mouseX,mouseY,rect.x,rect.y,rect.w,rect.h);
    }
	mouseReleased(xi,yi,isInHand){
		let rect = this.getRect(xi,yi);
		this.mouseIsOver = collidePointRect(mouseX,mouseY,rect.x,rect.y,rect.w,rect.h);
		if(this.currentState === 'inHand'+game.playerLetter) {
			if (this.mouseIsOver) {
				network.selectCard(this.id);
			}
		}
	}
		
	handDraw(cardRect) {
		fill(colors.card.hand.normal);
		if(this.mouseIsOver) {
			fill(colors.card.hand.hover);
		}
		rect(0, 0, cardRect.w, cardRect.h, 5); // draw card
		image(IMG.icon.characters[this.icon],
			(cardRect.w - cardRect.h*0.25)/2,
			cardRect.h*0.05,
			cardRect.h*0.25,
			cardRect.h*0.25);
		let ts = cardRect.h*0.1;
		textSize(ts);
		while(textWidth(this.name) > cardRect.w) {
			ts--;
			textSize(ts);
			if(ts < 8){
				break;
			}
		}
		textAlign(CENTER, TOP);
		fill(colors.iconText);
		text(this.name,
			0,
			cardRect.h*0.3,
			cardRect.w,
			cardRect.h*0.10);

		textSize(cardRect.h*0.1);
		imageMode(CORNER);
		tint(colors.health);
		image(IMG.icon.health,
			(cardRect.w/4) - cardRect.h*0.1,
			cardRect.h*0.4,
			cardRect.h*0.2,
			cardRect.h*0.2);
		text(this.health,
			0,
			cardRect.h*0.43,
			cardRect.w/2,
			cardRect.h*0.20);


		tint(colors.armor);
		image(IMG.icon.armor,
			(cardRect.w*(3/4)) - cardRect.h*0.1,
			cardRect.h*0.4,
			cardRect.h*0.2,
			cardRect.h*0.2);
		text(this.armor,
			cardRect.w/2,
			cardRect.h*0.43,
			cardRect.w/2,
			cardRect.h*0.20);

		let attackHeight = cardRect.h*0.4 / (this.attacks.length+1);
		let attackStep = cardRect.h*0.4 / this.attacks.length;
		translate(0,cardRect.h*0.6 + attackStep/5);
		for(let i = 0; i <  this.attacks.length; i++) {
			this.attacks[i].draw(this.currentState,{w:cardRect.w, h:attackHeight}); //TODO xi and yi are
			translate(0,cardRect.h*0.4 / this.attacks.length);
		}
	}
	duelDraw() {
	    const cardWidth = this.cardWidth * 2;
	    const cardHeight = this.cardHeight;

		push(); //card
			rect(0, 0, cardWidth, cardHeight, 5); // draw card
			image(IMG.icon.characters[this.icon], cardWidth*0.2-cardHeight*0.2, cardHeight*.1,cardHeight*0.4,cardHeight*0.4);
			push(); //Stats
				translate(cardWidth*0.05,cardHeight*.5); //drop below image
                textAlign(CENTER,CENTER);
				push();//Health
					tint(colors.health);
					image(IMG.icon.health, 0, 0,cardWidth*.15,cardWidth*.15); // render icon
					fill(colors.iconText);
					text(this.health,  cardWidth*.075, cardWidth*.075); // health value
				pop();//Health
				push();//Armor
					tint(colors.armor);
					translate(cardWidth/5,0); //move over
					image(IMG.icon.armor, 0,0,cardWidth*.15,cardWidth*.15); // render icon
					fill(colors.iconText);
					text(this.armor, cardWidth*.075, cardWidth*.075); // health value
				pop();//Armor
                push(); //Name
                    translate(-cardWidth*0.025,cardHeight*.3);
                    textAlign(LEFT,TOP);
                    text(this.name,0,0); //TODO change from name to id
                 pop(); //Name
			pop();//stats
			push(); //Attacks
        		translate(cardWidth*0.4,cardHeight*.1);
        		for(let i = 0; i < this.attacks.length; i++) {
                    this.attacks[i].duelDraw(cardWidth,cardHeight,this);
                    translate(0,cardHeight*0.45);
				}
			pop();//Attacks
		pop();//card
	}
	
    //helpers
    getHandRect(xi,yi) {
        if(this.mouseIsOver) {
            xi -= (this.cardWidth-this.cardWidth/defaults.card.mouseIsOverScale)/2;
            if (this.owner === 0 ) { //TODO fix this.onwer
                yi -= (this.cardHeight-(this.cardHeight/defaults.card.mouseIsOverScale));
            }
        }
        return {
            x: xi,
            y: yi,
            w: this.cardWidth,
            h: this.cardHeight
        };
    }
    getDuelRect(xi,yi) {
        if(this.mouseIsOver) {
            xi -= (this.cardWidth-this.cardWidth/defaults.card.mouseIsOverScale)/2;
            if (this.owner === 0 ) { //TODO fix this.onwer
                yi -= (this.cardHeight-(this.cardHeight/defaults.card.mouseIsOverScale));
            }
        }
        return {
            x: xi,
            y: yi,
            w: this.cardWidth*2,
            h: this.cardHeight
        };
    }

}