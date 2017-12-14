if(defaults === undefined) {defaults = {}}

defaults.animation = {
	startEpoch: function () { return frameTime;},
	val: function () {return 1;}
};