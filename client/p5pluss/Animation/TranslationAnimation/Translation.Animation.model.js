class TranslationAnimation extends Animation {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.val = json.val === undefined ? defaults.animation.translation.val() : json.val;
		super(json);

	}
	get x(){
		if(this._keyValues.length > 0) {
			let p = this.currentPercentToNextKeyValue;
			return this._val.x * (1 - p) + this._keyValues[0].val.x*p;
		}
		return this._val.x;
	}
	get y() {
		if(this._keyValues.length > 0) {
			let p = this.currentPercentToNextKeyValue;
			return this._val.y * (1 - p) + this._keyValues[0].val.y*p;
		}
		return this._val.y;
	}
	applyEffect(sprite) {
		super.applyEffect(sprite);
		translate(this.x,this.y);
	}

	applyEffectMouse(sprite) {
		translateMouse(this.x,this.y);
	}
}