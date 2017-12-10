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
	},
	selected: {
		size: {
			width: function () {
				return width/2;
			},
			height: function () {
				return defaults.card.selected.size.width();
			}
		}
	}
};