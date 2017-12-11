class ScaleAnimation extends Animation {
	constructor(startWidth,startHeight,endWidth,endHeight,millisecondsToComplete,callBack) {
		super(millisecondsToComplete,callBack);
		this.startWidth = startWidth;
		this.endWidth = endWidth;
		this.startHeight = startHeight;
		this.endHeight = endHeight;
	}
	get currentWidth() {
		return this.startWidth*(1-this.percentComplete) + this.endWidth*this.percentComplete;
	}
	get currentHeight() {
		return this.startHeight*(1-this.percentComplete) + this.endHeight*this.percentComplete;
	}
	applyEffect(){
		scale(this.currentWidth,this.currentHeight);
	}
}