class Attack {
	constructor(json) {
		this.loadJSON(json);
	}
	loadJSON(json){
		this.id = json.id;
		this.name = json.name === undefined ? `No Name Attack` : json.name;
		this.health = json.health;
		this.armor = json.armor;
		this.speed = json.speed;
		this.category = json.category;
	}

	duelDraw(rect){
		push();
			fill(colors.attack[this.category]);
			tint(colors.attack.icon);
			ellipse(
				rect.x,
				rect.y,
				rect.h,
				rect.h);
			image(icons.attack[this.category],
				rect.x + rect.h*0.1,
				rect.h*0.1,
				rect.h*0.8,
				rect.h*0.8);
			fill(colors.card.text);
			textSize(rect.h * 0.8);
			textAlign(LEFT,TOP);
			text(this.name,
				rect.x + rect.h*1.1,
				rect.y,
				rect.w - rect.h*0.8,
				rect.h);
		pop()
	}

	handDraw(rect) {
		push();
			fill(colors.attack[this.category]);
			tint(colors.attack.icon);
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
}