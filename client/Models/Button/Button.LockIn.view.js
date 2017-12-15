class ButtonLockIn extends Sprite {
	constructor(json){
		json = json === undefined ? {} : json;
		json.fillColor = colors.button.lockIn.background;
		super(json);
	}

	draw() {
		push();
		this.applyAnimations();
		let txt ='bad state for this btn';
		if(this.parentSprite.currentState === 'selected') {
			fill(colors.button.lockIn.background);
			txt = strings.button.lockIn;
		} else if(this.parentSprite.currentState === 'lockedIn') {
			fill(colors.button.lockedIn.background);
			txt = strings.button.lockedIn;
		}
		rect(0,0,this.bounds.w,this.bounds.h,5);

		textSize(this.bounds.h * 0.4);
		textAlign(CENTER, CENTER);
		fill(colors.attack.text);
		text(txt, this.bounds.w /2, this.bounds.h / 2);
		this.drawSubViews();
		pop();
	}

	touchEnded() {
		pushMouse();
		let didTap = super.touchEnded();
		if(didTap) {
			network.lockIn(this.parentSprite.id);
		}
		popMouse();
	}
}