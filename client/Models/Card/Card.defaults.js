defaults.card = {
	inHand: {
		size: {
			width: function () {
				return width/4;
			},
			height: function () {
				return defaults.card.inHand.size.width();
			}
		}
	}
};