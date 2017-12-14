class FloatingText extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fontSize = json.fontSize === undefined ? 14 : json.fontSize;
		super(json);
		this.text = json.text === undefined ? '' : json.text;

		json.halfLife = json.halfLife === undefined ? 2000 : json.halfLife; //do we need htis
	}
	draw() {
		push();
		super.applyAnimations();
		textAlign(LEFT,TOP);
		textSize(this.bounds.h*this.scaleAnimation.height);
		text(this.text,0,0);
		super.drawSubViews();
		pop();
	}
}