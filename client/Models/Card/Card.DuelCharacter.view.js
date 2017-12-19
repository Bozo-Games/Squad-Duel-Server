class CardDuelCharacter extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			//rect(this.global.x, this.global.y, this.global.h, this.global.h);
			let img = icons.getCharacter(this.name, this.loop);
			image(img, 0,0, this.w, this.h);
			this.drawSubSprites();
			pop();
		}
	}

	jump(callBack,time=2100) {
		this.loop = 'attack';
		this.push(new AnimationValue({
			x:this.animation.x,
			y:this.animation.y+this.h*0.2,
			w:1,
			h:0.8,
			time: time*0.1,
			callBack: function (card) {
				card.push(new AnimationValue({
					x:card.animation.x,
					y:card.animation.y-card.h/2 - card.h*0.2,
					w:1,
					h:1.1,
					time: time*0.35,
					callBack: function (card) {
						card.push(new AnimationValue({
							x: card.animation.x,
							y: card.animation.y,
							w: 1,
							h: 1,
							time: time * 0.1,
							callBack: function (card) {
								card.push(new AnimationValue({
									x: card.animation.x,
									y: card.animation.y+card.h/2+card.h*0.2,
									w: 1,
									h: 0.8,
									time: time * 0.35,
									callBack: function (card) {
										card.push(new AnimationValue({
											x: 0,
											y: 0,
											w: 1,
											h: 1,
											time: time * 0.1,
											callBack:function (card) {
												card.loop = 'idle';
												if(typeof  callBack === 'function') {
													callBack(card);
												}
											}}));
									}}));
							}}));
					}}));
			}}));
	}
}