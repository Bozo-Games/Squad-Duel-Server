class Card {
	constructor(json) {
		json = json === undefined ? cardList[Math.floor(Math.random() * 18)] : json;
		this.health = json.health === undefined ? 0 : json.health; 
		this.armor = json.armor === undefined ? 0 : json.armor; 
		this.speed = json.speed === undefined ? 0 : json.speed; 
//		this.power = json.power === undefined ? 0 : json.power; 
		this.attack1 = json.attack1 === undefined ? new attack() : new attack(json.attack1);
		this.attack2 = json.attack2 === undefined ? new attack() : new attack(json.attack2);

		this.owner = json.owner === undefined ? 0 : json.owner; // player 0, opponent 1
		this.mouseHit = false;
		this.isSelected = false;
		this.cardWidthRatio = 12; //default card width
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
			attack1:this.attack1.toJSON(),
			attack2:this.attack2.toJSON()
		};
	}
	//mouse events
	mouseReleased () {
  		if (mouseButton == LEFT && this.mouseHit) {
  			console.log('Clicked card');
			this.isSelected = true;
			//this.mouseHit = false;
		}
	}
	
	//draw
	draw() {

		this.handDraw();

	}
		
	handDraw() {

		var statHealth = this.health;
		var statArmor = this.armor;
		var statSpeed = this.speed;
		var statAttack = this.attack1.attackName;
		var	statAttackSpeed = this.attack1.speed + this.speed;
		var	statAttackDamage = this.attack1.power;
		var statAttack2 = this.attack2.attackName;
		var	statAttackSpeed2 = this.attack2.speed + this.speed;
		var	statAttackDamage2 = this.attack2.power;
		
		push();	

		if(this.mouseHit) {
			if (this.owner == 0 ) {
				translate(-this.cardWidth/2,-this.cardHeight);
			}
			else {
				translate(-this.cardWidth/2, 0);
			}
			scale(2,2);
		}
		rect(0, 0, this.cardWidth, this.cardHeight, 5); // draw card
		tint('Black');
		image(IMG.icon.character, this.cardWidth*.25, this.cardWidth*.1,IMG.icon.character.width/5,IMG.icon.character.height/5);

		push();
		translate(4,this.cardHeight*.5); //drop below image
		textSize('10');

		push();
		tint('#ce3b3b')
		image(IMG.icon.health, -2, -10,IMG.icon.health.width/7,IMG.icon.health.height/7); // render icon
		fill('black');
		text(statHealth, 4, 5); // health value
		pop();
		tint('#6b9dca')
		translate(this.cardWidth/3,0); //drop below image
		image(IMG.icon.armor, -4, -10,IMG.icon.armor.width/7,IMG.icon.armor.height/7); // render icon
		text(statArmor, 3, 5); // health value
		
		tint('pink')		
		translate(this.cardWidth/3,0); //drop below image
		image(IMG.icon.speed, -4, -10,IMG.icon.speed.width/7,IMG.icon.speed.height/7); // render icon
		text(statSpeed, 3, 5); // health value
		pop();

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
		
		pop();

	}
		duelDraw() {

		var statHealth = this.health;
		var statArmor = this.armor;
		var statSpeed = this.speed;
		var statAttack = this.attack1.attackName;
		var	statAttackSpeed = this.attack1.speed + this.speed;
		var	statAttackDamage = this.attack1.power;
		var statAttack2 = this.attack2.attackName;
		var	statAttackSpeed2 = this.attack2.speed + this.speed;
		var	statAttackDamage2 = this.attack2.power;

		push();	
		scale(2,2);

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
		image(this.attack1.icon, 10, 16,this.attack1.icon.width/7,this.attack1.icon.height/7); // render icon	

		textSize('14')
		text(statAttackDamage,5,26);
		tint('pink');
		image(IMG.icon.speed, 36, 14,this.attack1.icon.width/7,this.attack1.icon.height/7); // render icon	
		text(statAttackSpeed, 42, 32); // health value



		textSize('9')
		translate(0, this.cardHeight*.5);
		rect(0, 0, this.cardWidth *.92, this.cardHeight*.4, 2);
		text(statAttack2,5,10);
		tint('black');
		image(this.attack2.icon, 8, 14,this.attack1.icon.width/7,this.attack1.icon.height/7); // render icon	
		
		textSize('14')
		text(statAttackDamage2,5,26);
		tint('pink');
		image(IMG.icon.speed, 36, 14,this.attack1.icon.width/7,this.attack1.icon.height/7); // render icon	
		text(statAttackSpeed2, 42, 32); // health value




		
		pop();

	}



}