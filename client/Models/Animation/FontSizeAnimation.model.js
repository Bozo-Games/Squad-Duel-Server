class FontSizeAnimation extends Animation {
	constructor(startFontSize,endFontSize,millisecondsToComplete,callBack) {
		super(millisecondsToComplete,callBack);
		this.startFontSize = startFontSize;
		this.endFontSize = endFontSize;
	}
	get currentFontSize() {
		return this.startFontSize*(1-this.percentComplete) + this.endFontSize*this.percentComplete;
	}
	applyEffect() {
		textSize(this.currentFontSize);
	}
}