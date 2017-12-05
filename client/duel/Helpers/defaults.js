const defaults = {
	drawing: {
		card: {
			hand: {
				width: function () {
					return defaults.drawing.hand.width() / (defaults.server.hand.numberOfCards+1);
				},
				height: function () {
					return 1.61803398875 * defaults.drawing.card.hand.width();
				},
				mouseIsOverScale:1.2
			},
			duel: {
				width: function () {
					return defaults.drawing.card.hand.width() * 2.5;
				},
				height: function () {
					return defaults.drawing.card.hand.height();
				}
			}
		},
		hand: {
			player: {
				initial: {
					x: function () {
						return (width - defaults.drawing.hand.width())/2;
					},
					y: function () {
						return height - defaults.drawing.card.hand.height() * 1.1;
					}
				}
			},
			opp: {
				initial: {
					x: function () {
						return defaults.drawing.hand.player.initial.x();
					},
					y: function () {
						return defaults.drawing.card.hand.height() * 0.1;
					}
				}
			},
			width: function () {
				return 0.6 * width;
			}
		}
	},
	server: {
		card: {
			numberOfAttacks: 2
		},
		hand: {
			numberOfCards: 3
		}
	},
};
module.exports = defaults;