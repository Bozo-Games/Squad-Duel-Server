'use strict';
/**
 *
 * @param json
 * @param json.val the value to be reached by end epoch
 * @param json.endEpoch the time since epoch when the val should be reached
 * @param json.callBack a function(sprite) to be called when the val is reached
 */
class KeyValue {
	/**
	 *
	 * @param json
	 * @param json.val the value to be reached by end epoch
	 * @param json.endEpoch the time since epoch when the val should be reached
	 * @param json.callBack a function(sprite) to be called when the val is reached
	 */
	constructor(json) {
		json = json === undefined ? {} : json;

		this._val = json.val === undefined ? defaultStatus.keyValue.val() : json.val;
		this._endEpoch = json.endEpoch === undefined ? defaults.keyValue.endEpoch() : json.endEpoch;
		this._callBack = json.callBack === undefined ? defaults.keyValue.callBack() : json.callBack;
	}

	get callBack() {
		return this._callBack;
	}
	/**
	 * the value to be reached by end epoch
	 * @returns {number}
	 */
	get val() {
		return this._val;
	}

	/**
	 * the time since epoch when the val should be reached
	 * @returns {number}
	 */
	get endEpoch() {
		return this._endEpoch;
	}

	/**
	 * will update the end epoch, will not accept end epochs before the current time
	 * @param endEpoch {number}
	 */
	set endEpoch(endEpoch) {
		this._endEpoch = Math.max(frameTime,endEpoch);
	}

	/**
	 *  a function(sprite) to be called when the val is reached
	 * @returns {function}
	 */
	get callBack() {
		return this._callBack;
	}

}