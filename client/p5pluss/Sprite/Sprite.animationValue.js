class AnimationValue {
	constructor(json) {
		json = json === undefined ? {} : json;
		checkJSONValue(this,json,'_x',['x'],0);
		checkJSONValue(this,json,'_y',['y'],0);
		checkJSONValue(this,json,'_w',['w','width'],1);
		checkJSONValue(this,json,'_h',['h','height'],1);
		checkJSONValue(this,json,'_endEpoch',['time'],0);
		this._endEpoch += frameTime;
		this._startEpoch = frameTime;
		checkJSONValue(this,json,'_callBack',['callBack'],undefined);
	}
	get callBack() {
		return this._callBack;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get w() {
		return this._w;
	}
	get h() {
		return this._h;
	}
	get startEpoch() {
		return this._startEpoch;
	}
	set startEpoch(newStartEpoch) {
		let time = this.endEpoch-this.startEpoch;
		this._endEpoch = newStartEpoch+time;
		this._startEpoch = newStartEpoch;
	}
	get endEpoch() {
		return this._endEpoch;
	}
	get percentToValue() {
		let totalTime = (this.endEpoch - this.startEpoch);
		if (totalTime <= 0) {
			return 1; //only key value
		} else {
			return Math.max(0,Math.min(1,(frameTime - this.startEpoch) / (this.endEpoch - this.startEpoch)));
		}
	}
}