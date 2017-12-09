class Animation {
	constructor(millisecondsToComplete,callBack) {
		this.startEpoch = (new Date()).getTime();
		this.endEpoch = this.startEpoch + millisecondsToComplete;
		this.callBack = callBack;
		console.log(`${this.startEpoch} -> ${this.endEpoch}`)
	}
	get percentComplete() {
		let timeSinceStart = (new Date()).getTime() - this.startEpoch;
		let totalTime = this.endEpoch - this.startEpoch;
		return Math.min(1,timeSinceStart / totalTime);
	}
	get isDone() {
		return (new Date()).getTime() > this.endEpoch;
	}
	applyEffect(){
		console.log('Warning '+this.constructor.name+' has no applyEffect Method');
	}
}