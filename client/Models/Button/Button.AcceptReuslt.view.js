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
		ellipse(this.bounds.w/2,this.bounds.h/2,this.bounds.w,this.bounds.h);
		tint('#ffffff');
		image(icons.button.acceptBtn,this.bounds.w/2,this.bounds.h/2,this.bounds.w,this.bounds.h);

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