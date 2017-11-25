class card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.health = json.health === undefined ? 0 : json.health; 
		this.armor = json.armor === undefined ? 0 : json.armor; 
		this.speed = json.speed === undefined ? 0 : json.speed; 
//		this.power = json.power === undefined ? 0 : json.power; 
		this.attack1 = json.attack1 === undefined ? new attack() : new attack(json.attack1);
		this.attack2 = json.attack2 === undefined ? new attack() : new attack(json.attack2);


		this.owner = json.owner === undefined ? 0 : json.owner; // player 0, opponent 1
		this.mouseHit = false;
		this.isSelected = false;
		this.cardWidthRatio = 11; //default card width
		this.cardHeightRatio = 16; // default card height
		this.cardScale = 6;
		this.cardWidth = this.cardWidthRatio * this.cardScale;
		this.cardHeight = this.cardHeightRatio * this.cardScale;

	}

	toJSON(){
		return {
			owner:this.owner,
			health:this.health,
			armor:this.armor,
			speed:this.speed,
			power:this.power,
			attack1:this.attack1.toJSON(),
			attack2:this.attack2.toJSON()
		};
	}
	
	draw() {
		var statHealth = this.health;
		var statArmor = this.armor;
		var statSpeed = this.speed;
		var statAttack = this.attack1.attackName;
		var statAttack2 = this.attack2.attackName;
		
		push();	

		if(this.mouseHit) {
			if (this.owner == 0 ) {
				translate(-this.cardWidth/2,-this.cardHeight);
				  if (mouseIsPressed) {
				  	if (mouseButton == LEFT) {
				  		console.log('Clicked card');
						this.isSelected = true;
				  	}
				}
			}
			else {
				translate(-cardWidth/2, 0);
			}
			scale(2,2);
		}
		rect(0, 0, this.cardWidth, this.cardHeight, 5); // draw card
		tint('Black');
		image(character, this.cardWidth*.25, this.cardWidth*.1,character.width/5,character.height/5);

		push();	
		textSize(14);
		translate(4,this.cardHeight*.5); //drop below image
		image(health, -2, -10,health.width/7,health.height/7); // render icon	
		fill('red')
		text(statHealth, 4, 5); // health value

		translate(this.cardWidth/3,0); //drop below image
		image(armor, -4, -10,armor.width/7,armor.height/7); // render icon	
		fill('green')
		text(statArmor, 3, 5); // health value
		
		translate(this.cardWidth/3,0); //drop below image
		image(speed, -4, -10,speed.width/7,speed.height/7); // render icon	
		fill('pink')
		text(statSpeed, 3	, 5); // health value
		pop();

		push();
		translate(0,this.cardHeight*.7); //drop below image
		rect(this.cardWidth *.05, 0, this.cardWidth *.90, 12, 2);
		fill('black');
		image(flat, -4, -10,flat.width/7,flat.height/7); // render icon	
		text(statAttack,this.cardWidth *.1,this.cardHeight*.8);
		pop();

		pop();



	}


}