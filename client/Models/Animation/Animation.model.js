class Animation {
	constructor(millisecondsToComplete,callBack) {
		this.startEpoch = (new Date()).getTime();
		this.endEpoch = this.startEpoch + millisecondsToComplete;
		if(callBack === undefined ) {
			callBack = function (obj) {
				console.log('empty callback from '+obj);
			}
		} else if(typeof callBack !== 'function' ) {
			console.log('broken here ' + callBack);
		}
		this.callBack = callBack;
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
		//console.log('Warning '+this.constructor.name+' has no applyEffect Method');
	}
}
