if(defaults === undefined) {defaults = {}}

defaults.keyValue = {
	val: function () {return 1;},
	endEpoch: function () {return frameTime + 1000;},
	callBack: function (sprite) {}
};