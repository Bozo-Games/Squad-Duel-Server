
const E = require('../../client/duel/Helpers/Enums.js');
let logger = {
	on: true,
	settings: {
		displayGameInfo: true,
		displayCardInfo: true,
		displayDuelInfo: true,

	},
	prepends: {
		game:'GAME: ',
		card:'CARD: ',
		duel:'DUEL: ',

	},
	log: function (kind,msg) {
		if(logger.on) {
			if (kind === E.logs.game) {
				if (logger.settings.displayGameInfo) {
					console.log(logger.prepends.game + msg);
				}
			} else if (kind === E.logs.card) {
				if (logger.settings.displayCardInfo) {
					console.log(logger.prepends.card + msg);
				}
			} else if (kind === E.logs.duel) {
				if (logger.settings.displayDuelInfo) {
					console.log(logger.prepends.duel + msg);
				}
			} else {
				console.log('Mysterious Kind (' + kind + '): ' + msg);
			}
		}
	}
};

module.exports = logger;
