class ScaleAnimation extends Animation {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.val = json.val === undefined ? defaults.animation.scale.val() : json.val;
		super(json);

	}
	get w() {
		return this.width;
	}
	get width() {
		if(this._keyValues.length > 0) {
			let p = this.currentPercentToNextKeyValue;
			return this._val.width * (1 - p) + this._keyValues[0].val.width*p;
		}
		return this._val.width;
	}
	get h(){
		return this.height;
	}
	get height(){
		if(this._keyValues.length > 0) {
			let p = this.currentPercentToNextKeyValue;
			return this._val.height * (1 - p) + this._keyValues[0].val.height*p;
		}
		return this._val.height;
	}
	applyEffect(sprite) {
		super.applyEffect(sprite);
		scale(this.w,this.h);
	}
	applyEffectMouse(sprite) {
		scaleMouse(this.w,this.h);
	}
}