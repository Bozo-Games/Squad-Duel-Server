class FloatingText extends Sprite {
	constructor(json) {
		super();
		json = json === undefined ? {} : json;
		this.color = json.color === undefined ? '#ffffff' : json.color;
		this.text = json.text === undefined ? '' : json.text;
		this.offset = json.offset === undefined ? {x:0,y:0} : json.offset;
		this.size = json.size === undefined ? 14 : json.size;
		this.activeAnimations = [];

		json.halfLife = json.halfLife === undefined ? 2000 : json.halfLife;
		this.startEpoch = (new Date()).getTime();
		this.endEpoch = this.startEpoch + json.halfLife;
	}
	draw() {
		push();
		textAlign(CENTER,CENTER);
		fill(this.color);
		textSize(this.size);
		let shouldExitDraw = super.applyActiveAnimations();
		if(shouldExitDraw) {
			pop();
			return (new Date()).getTime() > this.endEpoch;
		}
		text(this.text,this.offset.x,this.offset.y);
		pop();
		return (new Date()).getTime() > this.endEpoch;
	}
}