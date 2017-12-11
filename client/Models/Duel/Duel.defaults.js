defaults.duel = {
	playerCard: {
		offset: {
			x: function () {
				return 20;
			},
			y: function () {
				return height * 0.45;
			}
		}
	},
	oppCard: {
		offset: {
			x: function () {
				return width - 20 - defaults.card.selected.size.width();
			},
			y: function () {
				return defaults.card.inHand.size.height()*1.8;
			}
		}
	}
};