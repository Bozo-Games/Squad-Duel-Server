class AttackDuelPlayer extends Attack {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = colors.attack.background;
		json.touchEnabled = false;
		json.strokeWeight = 3;
		super(json);
	}

	draw() {
		push();
		this.applyAnimations();
		if(currentGame.duel.playerAttack !== undefined) {
			if(currentGame.duel.playerAttack.id === this.id) {
				fill(colors.attack.selected);
			}
		}
		rect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h,5);

		textSize(this.bounds.h*0.4);
		textAlign(LEFT,TOP);
		fill(colors.attack.text);
		text(this.name,this.bounds.w*0.05,0);
		this.drawSubViews();
		pop();
	}
	touchEnded() {
		pushMouse();
		let touchEnded = super.touchEnded();
		if(touchEnded) {
			network.selectAttack(this.id);
		}
		popMouse();
	}
}