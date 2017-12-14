if(defaults === undefined) {defaults = {}}
defaults.animation = defaults.animation === undefined ? {} : defaults.animation;

defaults.animation.scale = {
	startEpoch: function () {return defaults.animation.startEpoch()},
	val: function () {return {width:1,height:1}},
	blank: function () { return new ScaleAnimation()}
};