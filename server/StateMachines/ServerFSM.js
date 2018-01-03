const machina = require('machina');
const helpers = require('../helpers.js');


let ServerFSM = new machina.BehavioralFsm({
	nameSpace: 'client',
	initialState: 'uninitialized',
	states: {
		uninitialized: {
			"*": function (instance) {
				instance.serverFSMid = helpers.guid();
				this.transition(instance, "readyForInput");
			}
		},
		down: {
			_onEnter: function (instance) {
				console.log('server down');
				this.transition(instance,'readyForInput');
			},
			handleInput: function (instance,dataSyncFunction) {
				this.deferUntilTransition(instance,"updatingData",dataSyncFunction);
			}
		},
		readyForInput: {
			_onEnter: function (instance) {
				console.log('server ready for input')
			},
			handleInput: function (instance,dataSyncFunction) {
				this.deferUntilTransition(instance,"updatingData",dataSyncFunction);

			}
		},
		updatingData:{
			_onEnter: function (instance) {

			},
			handleInput: function (instance,dataSyncFunction) {
				console.log('handleing Input');
				if(dataSyncFunction()) {
					this.transition(instance,'readyForInput')
				} else {
					this.transition(instance,'down')
				}
			}
		}
	},
	//public methods
	initialize: function (instance) {
		this.handle(instance,'*');
	},
	handleInput: function (instance,dataSyncFunction) {
		ServerFSM.handle(instance,'handleInput',dataSyncFunction);
	}
});


module.exports = ServerFSM;