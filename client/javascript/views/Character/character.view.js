class CharacterView extends Sprite {
	constructor(json) {
		super(json);
		this.name = json.name === undefined ? '' : json.name;
	}
	animate(json) {
		this.id = json.id;
		this.name = json.name;
		this.health = json.health;
		this.armor = json.armor;
		this.speed = json.speed;
		this.stamina = json.stamina;
		this.maxStamina = json.maxStamina;
		if(this.parentSprite !== undefined) {
			if (json.state === 'new' && this.constructor.name !== 'WanderCharacterView') {
				let newView = new WanderCharacterView({
					x: this.root.x,
					y: this.root.y,
					w: this.root.w,
					h: this.root.h,
				});
				this.parentSprite.swapSprite(this, newView);
				newView.loadJSON(json);
			} else if (json.state === 'bench' && this.constructor.name !== 'BenchCharacterView') {
				let newView = new BenchCharacterView({
					x: this.root.x,
					y: this.root.y,
					w: this.root.w,
					h: this.root.h,
				});
				this.parentSprite.swapSprite(this, newView);
				newView.loadJSON(json);
			}
		}

		this.state = json.state;
	}


	drawCharacter() {
		imageMode(CENTER);
		let img = icons.getCharacter('Knight', this.lastAnimationData.loop,this.loopOffSet);
		image(img,0,0,this.w,this.h);
	}
	drawName() {
		textAlign(CENTER,BOTTOM);
		fill('#000');
		if(this.lastAnimationData.w < 0) {scale(-1,1);}
		text(this.name,0,this.h/2);
	}

}