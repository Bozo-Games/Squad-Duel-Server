const machina = require('machina');
const helpers = require('../helpers.js');
const Animation = require('./AnimationFSM.js');

let SpriteFSM = new machina.BehavioralFsm({
	nameSpace: 'client',
	initialState: 'uninitialized',
	states: {
		uninitialized: {
			"*": function (instance) {
				instance.SpriteFSMid = helpers.guid();
				this.deferUntilTransition(instance);
				this.transition(instance, "readyForData");
			}
		},
		readyForData: {
			_onEnter:function (instance) {
			},
			loadJSON: function (instance,json) {
				instance.nextJSON = json;
				instance.animate(json);
				this.transition(instance,'animating');
			}
		},
		animating: {
			_onEnter:function (instance) {
				if(Animation.compositeState(instance.animation) === 'endFrame') {
					this.transition(instance,'syncingData');
				} else {
					instance.clieantWaitingForAnimationFinish = Animation.on("animationDone",function (data) {
						if(data.instance.id === instance.animation.id) {
							this.transition(instance,'syncingData');
						}
					}.bind(this));
				}
			},
			_onExit:function (instance) {
				if(instance.clieantWaitingForAnimationFinish !== undefined) {
					instance.clieantWaitingForAnimationFinish.off();
				}
			},
			loadJSON: function (instance,json) {
				this.deferUntilTransition(instance,"readyForData");
			}
		},
		waitingOnSubSprites: {
			_onEnter: function(instance) {
				instance.waitingOnSubeSpritesToFinish = Animation.on("animationDone",function (data) {
					let stillAnimating = false;
					for(let sprite of instance.subSprites) {
						stillAnimating = stillAnimating || sprite.isAnimating;
					}
					if(!stillAnimating) {
						this.transition(instance,'readyForData');
					}}.bind(this));
			},
			_onExit: function (instance) {
				instance.waitingOnSubeSpritesToFinish.off();
				instance.waitingOnSubeSpritesToFinish = undefined;
			},
			loadJSON: function (instance,json) {
				this.deferUntilTransition(instance,"readyForData");
			}
		},
		syncingData: {
			_onEnter:function (instance) {
				instance.currentJSON = instance.nextJSON;
				for(let sprite of instance.subSprites) {
					if(sprite.isAnimating) {
						this.transition(instance,'waitingOnSubSprites');
						return;
					}
				}
				this.transition(instance,'readyForData');
			},
			loadJSON: function (instance,json) {
				this.deferUntilTransition(instance,"readyForData");
			}
		}
	},
	//public methods
	initialize: function (instance) {
		this.handle(instance,'*');
	},
	loadJSON(instance,json) {
		this.handle(instance,'loadJSON',json);
	},
	currentState: function (instance) {
		return this.compositeState(instance);
	}
});


module.exports = SpriteFSM;