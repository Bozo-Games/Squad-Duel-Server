class TranslationAnimation extends Animation {
	constructor(startX,startY,endX,endY,millisecondsToComplete,callBack) {
		super(millisecondsToComplete,callBack);
		this.startX = startX;
		this.endX = endX;
		this.startY = startY;
		this.endY = endY;
	}
	get currentX() {
		return this.startX*(1-this.percentComplete) + this.endX*this.percentComplete;
	}
	get currentY() {
		return this.startY*(1-this.percentComplete) + this.endY*this.percentComplete;
	}
	applyEffect(){
		//console.log(`translating - (${this.currentX},${this.currentY})`);
		translate(this.currentX,this.currentY);
	}
}