class AttackDuelPlayer extends Attack {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = colors.attack.background;
		json.strokeWeight = 3;

		super(json);
	}

	draw() {
		push();
		this.applyAnimations();
		rect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h,5);

		textSize(this.bounds.h*0.4);
		textAlign(LEFT,TOP);
		fill(colors.attack.text);
		text(this.name,this.bounds.w*0.05,0);
		this.drawSubViews();
		pop();
	}
}