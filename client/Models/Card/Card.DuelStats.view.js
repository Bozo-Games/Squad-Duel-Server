class CardDuelStats extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.color = colors.card.inHand.background;
		json.strokeWeight = 3;
		super(json);
	}

	draw() {
		push();
		super.applyTransformations();
		rect(0,0,this.global.w,this.global.h,5);

		let iconSize = this.global.h / 5;
		let y = (iconSize)/5;
		let step = iconSize + y;
		fill(colors.card.text);
		textSize(iconSize*0.8);
		strokeWeight(1);
		textAlign(LEFT,TOP);
		['health','armor','speed','power'].forEach(function (stat) {
			tint(colors.card[stat]);
			image(icons.card[stat],(this.global.w*0.5-iconSize)/2,y,iconSize,iconSize);
			text(this[stat],this.global.w*0.55,y);
			y += step;
		}.bind(this));
		super.drawSubSprites();
		pop();
	}

	//-------------------------------------------------------------------------- animations
	stateChangeAnimation(from,to,json) {
		if(from === 'inHand' && to === 'selected' && this.isPlayerCard) {
			this.show(function (card) {
				card.currentState = 'selected';
				card.loadJSON(json);
			},defaults.card.duelStats.animationTimes.show);
			return false; //json was not loaded
		} else {
			return super.stateChangeAnimation(from,to,json);
		}
	}
	swapCard(json) {
		if(this.currentState === 'selected' && this.isPlayerCard) {
			this.hide(function (card) {
				card.currentState = 'inHand';
				for(let key of ['id','health','armor','speed','power']) {
					card[key] = json[key];
				}
				card.holdAnimation(function (card) {
					card.loadJSON(json);
				},defaults.card.duelStats.animationTimes.pauseTime)
			},defaults.card.duelStats.animationTimes.hide);
			return false; //json was not loaded
		} else {
			return super.swapCard(json);
		}
	}
	show(callBack,time=800){
		this.moveToLocal(0,0,callBack,time)
	}
	hide(callBack,time=800){
		this.moveToGlobal(-this.w*1.1,this.global.y,callBack,time);
	}
	hideRight(callBack,time=800){
		this.moveToGlobal(width,this.global.y,callBack,time);
	}
}