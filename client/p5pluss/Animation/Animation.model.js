class Animation {
	/**
	 *
	 * @param json
	 * @param json.startEpoch - the start time since epoch
	 * @param json.val - the start value
	 *
	 */
	constructor(json) {
		json = json === undefined ? {} : json;

		this._startEpoch = json.startEpoch === undefined ? defaults.animation.startEpoch() : json.startEpoch;
		this._val = json.val === undefined ? defaults.animation.val() : json.val;
		this._keyValues = [];
	}

	/**
	 * returns the percent to the next key value based on current time
	 * @returns {number}
	 */
	get currentPercentToNextKeyValue() {
		if(this._keyValues.length > 0) {
			let totalTime = (this._keyValues[0].endEpoch - this._startEpoch);
			if (totalTime <= 0) {
				return 1; //only key value
			} else {
				return Math.max(0,Math.min(1,(frameTime - this._startEpoch) / (this._keyValues[0].endEpoch - this._startEpoch)));
			}
		}
		return 0;// only start value

	}

	/**
	 * return a value between the set value and next key value based on current time
	 * @returns {number}
	 */
	get currentValue() {
		if(this._keyValues.length > 0) {
			let p = this.currentPercentToNextKeyValue;
			return this._val * (1 - p) + this._keyValues[0].val*p;
		}
		return this._val;
	}

	/**
	 * updates the current value and returns any callbacks completed
	 * @param sprite - the sprite to receive the callbacks
	 */
	applyEffect(sprite) {
		if(this._keyValues.length > 0) {
			if((frameTime - this._keyValues[0].endEpoch) > 0 ) {
				this._val = this._keyValues[0].val;
				this._startEpoch = this._keyValues[0].endEpoch;
				let cb = this._keyValues[0].callBack;
				this._keyValues.splice(0, 1);
				if(typeof cb === 'function') {
					cb(sprite);
				}
			}
		}
		//here is where the effect would be applied
	}

	/**
	 * will force current value the the last key value
	 * @param val - new value to be over ridden, no callback will be called
	 */
	forceUpdate(val) {
		this._keyValues = [];
		this._startEpoch = frameTime;
		this._val = val;
	}

	/**
	 * adds the kye value to the end of the array
	 * @param keyValue - will adjust the end epoch to be after the last value in the queue
	 */
	appendKeyValue(keyValue) {
		if(this._keyValues.length > 0) {
			if(this._keyValues[this._keyValues.length -1].endEpoch > keyValue.endEpoch) {
				keyValue.endEpoch = this._keyValues[this._keyValues.length -1].endEpoch + (keyValue.endEpoch - frameTime);
			}
			this._keyValues.push(keyValue);
		} else {
			this._startEpoch = frameTime;
			this._keyValues.push(keyValue);
		}
	}

	applyEffectMouse(sprite) {

	}
}