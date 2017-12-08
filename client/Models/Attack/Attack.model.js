class Attack {
	constructor(json) {
		this.id = json.id;
		this.health = json.health;
		this.armor = json.armor;
		this.speed = json.speed;
		this.category = json.category;
		this.icon = icons.attack[this.category];
	}
	onTap(){

	}
	draw(){

	}
}