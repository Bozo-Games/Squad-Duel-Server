class CardInHand extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = json.fillColor === undefined ? colors.card.inHand.background : json.fillColor;
		json.strokeWeight = json.strokeWeight === undefined ? defaults.card.inHand.strokeWeight : json.strokeWeight;
		super(json);
	}
	draw() {
		push();
			this.applyTransformations();
			ellipseMode(CORNER);
			ellipse(0,0,this.w,this.h);

			let img = icons.getCharacter(this.name,this.loop);
			if(this.currentState === 'dead') {
				img = icons.card[this.name].dead;
			}
			image(img,0,0,this.w, this.h);

			//get ready for icons
	        imageMode(CENTER);
    	    let iconSize = this.w * defaults.card.inHand.iconScale;
			textAlign(CENTER, CENTER);
			fill(colors.card.text);
			tint(colors.card.health);
			//health

			let letterScale = 0.5;
			textSize(iconSize*letterScale);
			while(textWidth(this.health) > iconSize*0.4) {
				letterScale -= 0.01;
				textSize(iconSize*letterScale);
			}
			image(icons.card.health,
				this.w - iconSize*.5,
				iconSize*.5,
				iconSize*1.35,
				iconSize*1.35);
        	if (this.armor > 0) {
                textSize(iconSize*letterScale);
                text(this.health, this.w - iconSize*.85,
                iconSize*letterScale);
                //(iconSize-(iconSize*letterScale)));
			//armor
				letterScale = 0.5;
				textSize(iconSize * letterScale);
				/*while (textWidth(this.armor) > iconSize * 0.4) {
					letterScale -= 0.01;
					textSize(iconSize * letterScale);
				}*/
				tint(colors.card.armor);
				image(icons.card.armor,
					(this.w - iconSize *.2),
					iconSize*.35,
					iconSize,
					iconSize);
				text(this.armor,
					(this.w) - iconSize*.2,// (iconSize + textWidth(this.armor)),
					(iconSize - (iconSize * letterScale))*.75);
			} else {
                let letterScale = 0.5;
                textSize(iconSize*letterScale);
                text(this.health,
                    this.w - iconSize*.5,
                    (iconSize-(iconSize*letterScale)));
            }

			//let letterScale = 0.5;
			//power
			tint(colors.card.power);
			image(icons.card.power,
                iconSize*.7,
				iconSize*.2,
				iconSize,
				iconSize
				);
			text(this.power,
                iconSize*.7,
                iconSize*.2);
			//speed
			tint(colors.card.speed);
			image(icons.card.speed,
                iconSize*.2,
				iconSize*.5,
				iconSize*.9,
				iconSize*.9
				);
			text(this.speed,
				iconSize*.2,
				iconSize*.66);
			//name
			textSize(14);
	        textAlign(LEFT, RIGHT);

        	fill(colors.card.name);
	        text(this.name,0,-iconSize*.25);

            this.drawSubSprites();
		pop();
	}
	touchEnded() {
		let didTap = super.touchEnded();
		if(didTap) {
			if(this.currentState === 'inHand') {
				network.selectCard(this.id);
			}
		}
	}
	//-------------------------------------------------------------------------- animations
	stateChangeAnimation(from,to,json) {
		if(from === 'inHand' && to === 'selected' && this.isPlayerCard) {
			this._moveOffDown(json);
			return false; //json was not loaded
		} else if(from === 'selected' && to === 'inHand' && this.isPlayerCard) {
			this._moveIn(json);
			return false; //json was not loaded
		} else if(from === 'dueling' && to === 'inHand') {
			this._moveIn(json);
			return false; //json was not loaded
		} else if(from === 'dueling' && to === 'dead') {
			this._moveIn(json);
			return false; //json was not loaded
		} else {
			return super.stateChangeAnimation(from,to,json);
		}
	}
	_moveIn(json) {
		this.moveToLocal(0,0,function (card) {
			card.currentState = json.currentState;
			card.loadJSON(json);
		},defaults.card.inHand.animationTimes.moveIn);
	}
	_moveOffDown(json) {
		this.moveToGlobal(this.global.x,height,function (card) {
			card.currentState = json.currentState;
			card.loadJSON(json);
		},defaults.card.inHand.animationTimes.moveOff);
	}
	moveOffUp() {
		this.moveToGlobal(this.global.x,-this.local.h,function (card) {

		},defaults.card.inHand.animationTimes.moveOff);
	}
}