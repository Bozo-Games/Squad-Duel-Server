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
		super.applyTransformations();
		textAlign(CENTER,CENTER);
		textSize(this.animation.h*this.h);
		text(this.text,this.w/2,this.h/2);
		super.drawSubSprites();
		pop();
	}
	shrinkCenter (callBack,time =1000) {
		this.push(new AnimationValue({
			x:0,
			y:0,
			w:1,
			h:1,
			time:1,
			callBack:function (floatingText) {
				floatingText.push(new AnimationValue({
					x:floatingText.w/2,
					y:floatingText.h/2,
					w:0,
					h:0,
					time: time,
					callBack:callBack
				}))
			}}));
	}
	floatAway(callBack,time =1000) {
		this.push(new AnimationValue({
			x:(Math.random() - Math.random())*this.w/2,
			y:-this.w/3,
			time:time,
			callBack:callBack
		}));
	}
}