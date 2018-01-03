class ButtonLockIn extends Sprite {
	constructor(json){
		json = json === undefined ? {} : json;
		json.fillColor = colors.button.lockIn.background;
		super(json);
	}

	draw() {
		push();
		this.applyTransformations();
		let txt ='bad state for this btn';
		if(this.parentSprite.playerCard.currentState === 'selected') {
			fill(colors.button.lockIn.background);
			txt = strings.button.lockIn;
		} else if(this.parentSprite.playerCard.currentState === 'lockedIn') {
			fill(colors.button.lockedIn.background);
			txt = strings.button.lockedIn;
		}
		rect(0,0,this.global.w,this.global.h,5);

		textSize(this.global.h * 0.4);
		textAlign(CENTER, CENTER);
		fill(colors.attack.text);
		text(txt, this.global.w /2, this.global.h / 2);
		this.drawSubSprites();
		pop();
	}

	touchEnded() {
		let didTap = super.touchEnded();
		if(didTap) {
			network.lockIn(this.parentSprite.playerCard.id);
		}
	}

	hide(callBack,time=200) {
		this.push(new AnimationValue({
			x:this.animation.x + this.w /2,
			y:this.animation.y + this.h /2,
			w: 0,
			h:0,
			time:time,
			callBack:callBack
		}))
	}
}