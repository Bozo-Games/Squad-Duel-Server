class CharacterHealthView extends Sprite {
	constructor(json) {
		super(json);
		this.health = 0;
		this.armorSprite = new CharacterArmorView({
			parentSprite:this,
			x:this.w*0.2,
			y:this.h*0.2,
			w:this.w*0.7,
			h:this.h*0.7
		})
	}

	animate(json) {
		this.armorSprite.loadJSON(json);
		if(this.health !== json.health) {

		}
		this.health = json.health;
	}

	draw() {
		push();
		super.applyTransformations();
		imageMode(CENTER);
		tint(colors.health);
		image(icons.stats.health,0,0,this.w,this.h);
		if(this.armorSprite.armor > 0) {
			textSize(this.h*0.2);
			textAlign(CENTER,CENTER);
			fill(colors.iconText);
			text(this.health,this.w*-0.2,this.h*-0.2);
		} else {
			textSize(this.h*0.4);
			textAlign(CENTER,CENTER);
			fill(colors.iconText);
			text(this.health,0,0);
		}
		super.drawSubSprites();
		pop();
	}

}