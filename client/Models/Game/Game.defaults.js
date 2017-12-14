defaults.game = {
	playerHand: {
		offset: {
			x: function () {
				return 0;
			},
			y: function () {
				return height - defaults.hand.offset.x() * 2 - defaults.card.inHand.size.height() *1.2
			}
		}
	},
	oppHand: {
		offset: {
			x: function () {
				return 0;
			},
			y: function () {
				return defaults.hand.offset.x();
			}
		}
	}
};