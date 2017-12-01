class Card {
	constructor(json) {
		json = json === undefined ? cardList[Math.floor(Math.random() * 18)] : json;
		this.id = json.id;
		this.health = json.health === undefined ? 0 : json.health; 
		this.armor = json.armor === undefined ? 0 : json.armor; 
		this.speed = json.speed === undefined ? 0 : json.speed; 
//		this.power = json.power === undefined ? 0 : json.power;
        this.attacks = [];
        for(let i = 0; i < json.attacks.length; i++) {
            this.attacks.push(new Attack(json.attacks[i]));
        }
        //mouse events
        this.mouseIsOver = false;

		//drawing things
		this.cardWidthRatio = defaults.card.width; //default card width
		this.cardHeightRatio = defaults.card.height; // default card height
		this.cardScale = defaults.card.scale;

        //TODO old things
        this.isSelected = false;
        this.owner = json.owner === undefined ? 0 : json.owner; // player 0, opponent 1
        this.mouseHit = false;

    }
	get cardWidth() {
	    if(this.mouseIsOver) {
	        return this.cardWidthRatio * this.cardScale * defaults.card.mouseIsOverScale;
        }
	    return this.cardWidthRatio * this.cardScale;
    }
    get cardHeight() {
        if(this.mouseIsOver) {
            return this.cardHeightRatio * this.cardScale * defaults.card.mouseIsOverScale;
        }
        return this.cardHeightRatio * this.cardScale;
    }

	toJSON(){
        let attacksJSON = [];
        for(let i = 0; i < this.attacks.length; i++) {
            attacksJSON.push(this.attacks[i].toJSON());
        }
		return {
		    id:this.id,
			owner:this.owner,
			health:this.health,
			armor:this.armor,
			speed:this.speed,
            attacks:attacksJSON
		};
	}
	//mouse events
    mouseMoved(xi,yi,isInHand) {
	    if(isInHand) {

        } else {
            const cardWidth = this.cardWidth * 2;
            const cardHeight = this.cardHeight;
            xi += cardWidth*0.4;
            yi += cardHeight*.1;
            for(let i = 0; i < this.attacks.length; i++) {
                this.attacks[i].mouseMoved(xi,yi,this.cardWidth,this.cardHeight);
                yi += cardHeight*0.45;
            }
        }
    }
	//draw
	draw() {
		this.handDraw();
	}
		
	handDraw() {

		let statHealth = this.health;
		let statArmor = this.armor;
		let statSpeed = this.speed;
		
		push(); //card
            if(this.mouseIsOver) {
                translate(-(this.cardWidth-this.cardWidth/defaults.card.mouseIsOverScale)/2, 0);
                if (this.owner === 0 ) { //TODO fix this.onwer
                    translate(0,-(this.cardHeight-(this.cardHeight/defaults.card.mouseIsOverScale)));
                }
            }
            rect(0, 0, this.cardWidth, this.cardHeight, 5); // draw card
            tint('Black');
            image(IMG.icon.character, (this.cardWidth - this.cardHeight*0.2)/2 , this.cardHeight*0.05,this.cardHeight*0.2,this.cardHeight*0.2);

            push(); //debug
                textAlign(CENTER,BOTTOM);
                text(this.id, (this.cardWidth)/2,0);
            pop();//Debug
            push(); //stats
                textAlign(CENTER,CENTER);
                if(this.mouseIsOver) { //TODO make relative to card width
                    textSize(16);
                } else {
                    textSize(8);
                }
                translate(this.cardWidth*0.08,this.cardHeight*.25); //drop below image
                push(); //health
                    tint(colors.health);
                    image(IMG.icon.health, this.cardWidth*0.05, 0,this.cardWidth*0.25,this.cardWidth*0.25); // render icon
                    fill(colors.iconText);
                    text(statHealth, this.cardWidth*0.175, this.cardWidth*0.125); // health value
                pop();//health
                translate(this.cardWidth*0.25,0);
                push(); //Armor
                    tint(colors.armor);
                    image(IMG.icon.armor, this.cardWidth*0.05, 0,this.cardWidth*0.25,this.cardWidth*0.25); // render icon
                    fill(colors.iconText);
                    text(statArmor, this.cardWidth*0.175, this.cardWidth*0.125); // health value
                pop(); //Armor
                translate(this.cardWidth*0.25,0);
                push(); //speed
                    tint(colors.speed);
                    image(IMG.icon.speed, this.cardWidth*0.05, 0,this.cardWidth*0.25,this.cardWidth*0.25); // render icon
                    fill(colors.iconText);
                    text(statSpeed, this.cardWidth*0.175, this.cardWidth*0.125); // health value
                pop(); //speed
            pop();//stats

            push(); //attacks
                translate(0,this.cardHeight*.25 + this.cardWidth*0.3); //drop below stats
                for(let i = 0; i < this.attacks.length; i++) {
                    this.attacks[i].handDraw(this.cardWidth,this.cardHeight);
                    translate(0,this.cardHeight*0.1+16); //drop below last attack
                }
            pop(); //attacks
        pop(); //card

	}
	duelDraw() {
	    const cardWidth = this.cardWidth * 2;
	    const cardHeight = this.cardHeight;

		push(); //card
			rect(0, 0, cardWidth, cardHeight, 5); // draw card
			tint('Black');
			image(IMG.icon.character, cardWidth*0.2-cardHeight*0.2, cardHeight*.1,cardHeight*0.4,cardHeight*0.4);
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
                    text(this.id,0,0); //TODO change from name to id
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