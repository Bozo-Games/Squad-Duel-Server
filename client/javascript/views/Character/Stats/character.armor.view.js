class CharacterArmorView extends Sprite {
	constructor(json) {
		super(json);
		this.armor = 0;
	}
	animate(json) {
		console.log('animating '+json.armor);
		if(this.armor !== json.armor) {
			if(json.armor > 0) {
				this.particle = new TextParticalView({
					w: this.w * 0.4,
					h: this.h * 0.4,
					dw: -0.2,
					dh: -0.2,
					maxCount: 2,
					minCount: 1,
					text: (json.armor - this.armor),
					minAngle: PI * 1.3,
					maxAngle: PI * 1.7,
					halfLife: 1000 / frameRate(),
					vel: this.w * 0.05,
					parentSprite: this
				});
				this.animation = {
					startFrame: {t: 1000},
					endFrame: {},
					callBack: function () {
						this.removeSubSprite(this.particle);
						this.particle = undefined;
						this.armor = json.armor;
					}.bind(this)
				}
			} else if(this.armor > 0) {
				let kf = [];
				for(let i = 0; i < 10; i++) {
					let r = i+5;
					kf.push({x:random(-r,r),y:random(-r,r),w:1+(i/10),h:1+(i/10),t:100});
				}
				kf.push({x:0,y:0,w:0,h:0,t:1});
				this.animation = {
					keyFrames:kf,
					endFrame: {x:0,y:0,w:1,h:1},
					callBack: function () {
						this.armor = json.armor;
					}.bind(this)
				};
			} else {
				this.armor = json.armor;
			}
		}
	}

	draw() {
		if(this.armor > 0) {
			push();
			super.applyTransformations();
			tint(colors.armor);
			imageMode(CENTER);
			image(icons.stats.armor, 0, 0, this.w, this.h);

			textSize(this.h * 0.4);
			textAlign(CENTER, CENTER);
			fill(colors.iconText);
			text(this.armor, 0, 0);

			super.drawSubSprites();
			pop();
		}
	}
}