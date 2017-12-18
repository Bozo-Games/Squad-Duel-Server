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
		this.applyTransformations();
		if(currentGame.duel.playerAttack !== undefined) {
			if(currentGame.duel.playerAttack.id === this.id) {
				fill(colors.attack.selected);
			}
		}
		rect(0,0,this.bounds.w,this.bounds.h,5);

		textSize(this.bounds.h*0.4);
		textAlign(CENTER,CENTER);
		fill(colors.attack.text);
		strokeWeight(1);
		text(this.name,this.bounds.w/2,this.bounds.h/2);
		this.drawSubSprites();
		pop();
	}
	touchEnded() {
		let touchEnded = super.touchEnded();
		if(touchEnded) {
			network.selectAttack(this.id);
		}
	}
	show(callBack,time = 800) {
		this.moveToLocal(0,0,callBack,time);
	}
	hide(callBack, time = 800) {
		this.moveToGlobal(width,this.bounds.y,callBack,time);
	}
}