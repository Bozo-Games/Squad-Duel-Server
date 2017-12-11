class Attack {
	constructor(json) {
		this.id = json.id;
		this.health = json.health;
		this.armor = json.armor;
		this.speed = json.speed;
		this.category = json.category;
	}
	loadJSON(json){
		this.id = json.id;
		this.health = json.health;
		this.armor = json.armor;
		this.speed = json.speed;
		this.category = json.category;
	}

	duelDraw(rect){
		push();
		fill(colors.attack[this.category]);
		tint('#ffffff');
		ellipse(
			rect.x,
			rect.y,
			rect.w,
			rect.h);
		image(icons.attack[this.category],
			rect.x + rect.w*0.1,
			rect.y + rect.h*0.1,
			rect.w*0.8,
			rect.h*0.8);
		pop()
	}

	handDraw(rect) {

	}
}