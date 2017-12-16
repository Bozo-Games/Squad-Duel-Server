class CardInHand extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = json.fillColor === undefined ? colors.card.inHand.background : json.fillColor;
		json.strokeWeight = json.strokeWeight === undefined ? defaults.card.inHand.strokeWeight : json.strokeWeight;
		super(json);
	}
	draw() {
		push();
			this.applyAnimations();
			ellipseMode(CORNER);
			ellipse(0,0,this.bounds.w,this.bounds.h);

			let img = icons.getCharacter(this.name,this.loop);
			if(this.currentState === 'dead') {
				img = icons.card[this.name].dead;
			}
			image(img,0,0,this.bounds.w, this.bounds.h);
			//get ready for icons
			let iconSize = this.bounds.w * defaults.card.inHand.iconScale;
			textAlign(LEFT,TOP);
			fill(colors.card.text);
			tint(colors.card.health);
			//health
			let letterScale = 0.5;
			textSize(iconSize*letterScale);
			while(textWidth(this.health) > iconSize*0.4) {
				letterScale -= 0.01;
				textSize(iconSize*letterScale);
			}
			image(icons.card.health,0,0, iconSize,iconSize);
			text(this.health,
				(iconSize-textWidth(this.health))/2,
				(iconSize-(iconSize*letterScale))/2.5);
			//armor
			letterScale = 0.5;
			textSize(iconSize*letterScale);
			while(textWidth(this.armor) > iconSize*0.4) {
				letterScale -= 0.01;
				textSize(iconSize*letterScale);
			}
			tint(colors.card.armor);
			image(icons.card.armor,
				(this.bounds.w -iconSize),
				0,
				iconSize,
				iconSize);
			text(this.armor,
				(this.bounds.w -iconSize)+(iconSize-textWidth(this.armor))/2,
				(iconSize-(iconSize*letterScale))/2.5);

			this.drawSubViews();
		pop();
	}
	touchEnded() {
		pushMouse();
		let didTap = super.touchEnded();
		if(didTap) {
			if(this.currentState === 'inHand') {
				network.selectCard(this.id);
			}
		}
		popMouse();
	}
}