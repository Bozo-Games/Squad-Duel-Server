class card {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.owner = json.owner === undefined ? 0 : json.owner; // player 0, opponent 1
		this.health = json.health === undefined ? 0 : json.health; 
		this.armor = json.armor === undefined ? 0 : json.armor; 
		this.speed = json.speed === undefined ? 0 : json.speed; 
		this.power = json.power === undefined ? 0 : json.power; 
		//this.attack1 = json.attack1 === undefined ? new Attack() : new Attack(json.attack1);
		//this.attack2 = json.attack2 === undefined ? new Attack() : new Attack(json.attack2);
		this.mouseHit = false;
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
		var statHealth = "Health: " + this.health;
		var statArmor = "Armor: " + this.armor;
		var statSpeed = "Speed: " + this.speed;
		var statAttack = "Attack 1";
		var statAttack2 = "Attack 2";
		
		push();
		if(this.mouseHit) {
			//fill('#00ff00')
			if (this.owner == 0 ) {
				translate(-27.5,-80);
			}
			else {
				translate(-27.5, 0);
			}
			scale(2,2);
		}
		rect(0, 0, 55, 80, 3); // draw card
		translate(0,0);
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
		pop();



	}


}