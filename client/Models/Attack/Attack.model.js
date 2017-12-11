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

	duelDraw(bounds){
		push();
			fill(colors.attack.selected.background);
			rect(bounds.x,
				bounds.y,
				bounds.w,
				bounds.h,
				4)
			fill(colors.attack[this.category]);
			tint(colors.attack.icon);
			ellipseMode(CORNER);
			ellipse(
				bounds.x+bounds.h*0.05,
				bounds.y+bounds.h*0.05,
				bounds.h*0.9,
				bounds.h*0.9);
			image(icons.attack[this.category],
				bounds.x + bounds.h*0.15,
				bounds.y + bounds.h*0.15,
				bounds.h*0.7,
				bounds.h*0.7);
			fill(colors.card.text);
			let ts = bounds.h*0.7;
			textSize(ts);
			while(textWidth(this.name) > (bounds.w - bounds.h*1.2)) {
				ts-=1;
				textSize(ts);
			}
			textAlign(LEFT,TOP);
			text(this.name,
				bounds.x + bounds.h*1.1,
				bounds.y + bounds.h*0.1,
				bounds.w - bounds.h*1.1,
				bounds.h*0.9);
		pop()
	}

	handDraw(bounds) {
		push();
			fill(colors.attack[this.category]);
			tint(colors.attack.icon);
			ellipse(
				bounds.x,
				bounds.y,
				bounds.w,
				bounds.h);
			image(icons.attack[this.category],
				bounds.x + bounds.w*0.1,
				bounds.y + bounds.h*0.1,
				bounds.w*0.8,
				bounds.h*0.8);
		pop()
	}
}