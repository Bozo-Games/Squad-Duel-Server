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
                tint('red');
		        image(IMG.icon.health, this.cardWidth*0.05, 0,this.cardWidth*0.25,this.cardWidth*0.25); // render icon
		        fill('black');
		        text(statHealth, this.cardWidth*0.175, this.cardWidth*0.125); // health value
		    pop();//health
            translate(this.cardWidth*0.25,0);
            push(); //Armor
                tint('green');
                image(IMG.icon.armor, this.cardWidth*0.05, 0,this.cardWidth*0.25,this.cardWidth*0.25); // render icon
                fill('black');
                text(statArmor, this.cardWidth*0.175, this.cardWidth*0.125); // health value
            pop(); //Armor
            translate(this.cardWidth*0.25,0);
            push(); //Armor
                tint('pink');
                image(IMG.icon.speed, this.cardWidth*0.05, 0,this.cardWidth*0.25,this.cardWidth*0.25); // render icon
                fill('black');
                text(statSpeed, this.cardWidth*0.175, this.cardWidth*0.125); // health value
            pop(); //Armor
		pop();//stats

        push(); //attacks
            translate(0,this.cardHeight*.25 + this.cardWidth*0.3); //drop below stats
            for(let i = 0; i < this.attacks.length; i++) {
                this.attacks[i].handDraw(this.cardWidth,this.cardHeight);
                translate(0,this.cardHeight*0.1+16); //drop below last attack
            }
        pop(); //attacks
        pop(); //card
        /*
		push();
		textSize(10);
		translate(0,this.cardHeight*.66); //drop below image
		rect(this.cardWidth *.03, 0, this.cardWidth *.92, 12, 2);
		fill('black');
		image(this.attack1.icon, 2, 0,this.attack1.icon.width/12,this.attack1.icon.height/12); // render icon	
		text(statAttack,this.attack1.icon.width *.09,10);
		pop();

		push();
		textSize(10);
		translate(0,this.cardHeight*.84); //drop below image
		rect(this.cardWidth *.03, 0, this.cardWidth *.92, 12, 2);
		fill('black');
		image(this.attack2.icon, 2, 0,this.attack2.icon.width/12,this.attack2.icon.height/12); // render icon	
		text(statAttack2,this.attack2.icon.width *.09,10);
		pop();
		
		pop();*/

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


}