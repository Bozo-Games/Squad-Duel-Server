class AnimationValue extends Animation {
	constructor(startValue,endValue,millisecondsToComplete,callBack) {
		super(millisecondsToComplete,callBack);
		this.startValue = startValue;
		this.endValue = endValue;
	}
	get currentValue() {
		return this.startValue*(1-this.percentComplete) + this.endValue*this.percentComplete;
	}
	applyEffect(){
		//do nothing
	}
}