
const E = require('../../client/duel/Helpers/Enums.js');
let logger = {
	settings: {
		displayGameStateMachineInfo: true,
		displaySeverGameModelInfo: true,
		displayCardStateMachineInfo: true,
		displayDuelStateMachineInfo: false,

	},
	prepends: {
		GameStateMachine:'GAME STATE MACHINE: ',
		cardStateMachine:'CARD STATE MACHINE: ',
		SeverGameModel:  ' SERVER GAME MODEL: ',
		duelStateMachine:  'DUEL STATE MACHINE: ',

	},
	log: function (kind,msg) {
		if(kind === E.logs.gameStateMachine) {
			if(logger.settings.displayGameStateMachineInfo) {
				console.log(logger.prepends.GameStateMachine + msg);
			}
		} else if(kind === E.logs.serverGameClass) {
			if(logger.settings.displaySeverGameModelInfo) {
				console.log(logger.prepends.SeverGameModel + msg);
			}
		} else if(kind === E.logs.cardStateMachine) {
			if(logger.settings.displayCardStateMachineInfo) {
				console.log(logger.prepends.cardStateMachine + msg);
			}
		} else if(kind === E.logs.duelStateMachine) {
			if(logger.settings.displayDuelStateMachineInfo) {
				console.log(logger.prepends.duelStateMachine + msg);
			}
		} else {
			console.log('Mysterious Kind ('+ kind + '): ' + msg);
		}
	}
};

module.exports = logger;
