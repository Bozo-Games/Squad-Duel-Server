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
		image(this.attacks[0].icon, 2, 0,this.attacks[0].icon.width/12,this.attacks[0].icon.height/12); // render icon	
		text(statAttack,this.attacks[0].icon.width *.09,10);
		pop();

		push();
		textSize(10);
		translate(0,this.cardHeight*.84); //drop below image
		rect(this.cardWidth *.03, 0, this.cardWidth *.92, 12, 2);
		fill('black');
		image(this.attacks[1].icon, 2, 0,this.attacks[1].icon.width/12,this.attacks[1].icon.height/12); // render icon	
		text(statAttack2,this.attacks[1].icon.width *.09,10);
		pop();
		
		pop();*/

	}
		duelDraw() {

		var statHealth = this.health;
		var statArmor = this.armor;
		var statSpeed = this.speed;
		var statAttack = this.attacks[0].attackName;
		var	statAttackSpeed = this.attacks[0].speed + this.speed;
		var	statAttackDamage = this.attacks[0].power;
		var statAttack2 = this.attacks[1].attackName;
		var	statAttackSpeed2 = this.attacks[1].speed + this.speed;
		var	statAttackDamage2 = this.attacks[1].power;

		push();	

		rect(0, 0, this.cardWidth*2, this.cardHeight, 5); // draw card
		tint('Black');
		image(IMG.icon.character, 10, this.cardWidth*.1,IMG.icon.character.width/3,IMG.icon.character.height/3);

		push();
		translate(4,this.cardHeight*.75); //drop below image

		push();
		tint('#ce3b3b')
		image(IMG.icon.health, 0, -10,IMG.icon.health.width/5,IMG.icon.health.height/5); // render icon
		fill('black');
		text(statHealth, 8, 8); // health value
		pop();
		tint('#6b9dca')
		translate(this.cardWidth/2,0); //drop below image
		image(IMG.icon.armor, -4, -10,IMG.icon.armor.width/5,IMG.icon.armor.height/5); // render icon
		fill('black');
		text(statArmor, 8, 8); // health value
		pop();

		textSize('9')
		translate(this.cardWidth, this.cardWidth*.075);
		rect(0, 0, this.cardWidth *.92, this.cardHeight*.4, 2);
		text(statAttack,5,10);
		image(this.attacks[0].icon, 10, 16,this.attacks[0].icon.width/7,this.attacks[0].icon.height/7); // render icon	

		textSize('14')
		text(statAttackDamage,5,26);
		tint('pink');
		image(IMG.icon.speed, 36, 14,this.attacks[0].icon.width/7,this.attacks[0].icon.height/7); // render icon	
		text(statAttackSpeed, 42, 32); // health value

		textSize('9')
		translate(0, this.cardHeight*.5);
		rect(0, 0, this.cardWidth *.92, this.cardHeight*.4, 2);
		text(statAttack2,5,10);
		tint('black');
		image(this.attacks[1].icon, 8, 14,this.attacks[0].icon.width/7,this.attacks[0].icon.height/7); // render icon	
		
		textSize('14')
		text(statAttackDamage2,5,26);
		tint('pink');
		image(IMG.icon.speed, 36, 14,this.attacks[0].icon.width/7,this.attacks[0].icon.height/7); // render icon	
		text(statAttackSpeed2, 42, 32); // health value




		
		pop();

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