defaults.hand = {
	offset: {
		x: function () {
			return defaults.card.inHand.width() / 4;
		},
		y: function () {
			return 0;
		}
	},
	step: {
		x: function () {
			return defaults.card.inHand.width() + defaults.card.inHand.offset.x();
		},
		y: function () {
			return 0;
		}
	}
};