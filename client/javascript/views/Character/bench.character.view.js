class BenchCharacterView extends CharacterView {
	constructor(json) {
		super(json);
		this.healthSprite = new CharacterHealthView({
			parentSprite:this,
			x: this.w * 0.3,
			y: -this.h * 0.3,
			w: this.w * 0.4,
			h: this.w * 0.4
		});
		this.healthSprite.debug = true;
	}

	animate(json) {
		super.animate(json);
		this.healthSprite.loadJSON(json);
	}
	draw() {
		push();
		super.applyTransformations();
		this.drawCharacter();
		this.drawName();
		super.drawSubSprites();
		pop();
	}
}