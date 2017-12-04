
const E = require('../../client/duel/Helpers/Enums.js');
let logger = {
	settings: {
		displayGameStateMachineInfo: true,
		displaySeverGameModelInfo: true,
	},
	prepends: {
		GameStateMachine:'GAME STATE MACHINE: ',
		SeverGameModel:  ' SERVER GAME MODEL: ',
	},
	log: function (kind,msg) {
		if(kind === E.logs.gameStateMachine && logger.settings.displayGameStateMachineInfo) {
			console.log(logger.prepends.GameStateMachine+msg);
		} else if(kind === E.logs.serverGameClass) {
			console.log(logger.prepends.SeverGameModel+msg);
		} else {
			console.log('Mysterious Kind ('+ kind + '): ' + msg);
		}
	}
};

module.exports = logger;
