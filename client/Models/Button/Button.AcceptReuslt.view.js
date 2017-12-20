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


	touchEnded() {
		let didTap = super.touchEnded();
		if(didTap && currentGame.iAmPrimaryPlayer) {
			network.acceptResults();
		}
	}
}