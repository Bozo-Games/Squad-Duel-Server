defaults.hand = {
	offset: {
		x: function () {
			return defaults.card.inHand.size.width() / 4;
		},
		y: function () {
			return 0;
		}
	},
	step: {
		x: function () {
			return defaults.card.inHand.size.width() + defaults.hand.offset.x();
		},
		y: function () {
			return 0;
		}
	}
};