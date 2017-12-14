if(defaults === undefined) {defaults = {}}
defaults.animation = defaults.animation === undefined ? {} : defaults.animation;

defaults.animation.translation = {
	startEpoch: function () {return defaults.animation.startEpoch()},
	val: function () {return {x:1,y:1}},
	blank: function () { return new TranslationAnimation()}
};