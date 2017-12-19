class ButtonAcceptReuslt extends Sprite {
	constructor(json){
		json = json === undefined ? {} : json;
		json.fillColor = colors.button.acceptResults.background;

		super(json);
	}

	draw() {
		push();
		this.applyTransformations();

		imageMode(CENTER);
		ellipseMode(CENTER);
		ellipse(this.global.w/2,this.global.h/2,this.global.w,this.global.h);
		tint('#ffffff');
		image(icons.button.acceptBtn,this.global.w/2,this.global.h/2,this.global.w,this.global.h);

		this.drawSubSprites();
		pop();
	}
	shrinkToNothing(time = 200,callBack) {
		this.push(new AnimationValue({
			x:this.local.x + this.w/2,
			y:this.local.y + this.h/2,
			w:0,
			h:0,
			time: time,
			callBack:callBack
		}));
	}

	touchEnded() {
		let didTap = super.touchEnded();
		if(didTap && currentGame.iAmPrimaryPlayer) {
			network.acceptResults();
		}
	}
}