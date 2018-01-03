const machina = require('machina');
const helpers = require('../helpers.js');
const Animation = require('./AnimationFSM.js');

let ClientFSM = new machina.BehavioralFsm({
	nameSpace: 'client',
	initialState: 'uninitialized',
	states: {
		uninitialized: {
			"*": function (instance) {
				instance.clientFSMid = helpers.guid();
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
		syncingData: {
			_onEnter:function (instance) {
				instance.currentJSON = instance.nextJSON;
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
		ClientFSM.handle(instance,'loadJSON',json);
	}
});


module.exports = ClientFSM;