defaults.card = {
	inHand: {
		size: {
			width: function () {
				return width/4;
			},
			height: function () {
				return defaults.card.inHand.size.width();
			}
		},
		iconScale:0.4
	},
	selected: {
		size: {
			width: function () {
				return width/2;
			},
			height: function () {
				return defaults.card.selected.size.width();
			}
		},
		icon: {
			size: {
				width: function () {
					return  defaults.card.selected.size.width()*0.08;
				},
				height: function () {
					return defaults.card.selected.icon.size.width();
				}
			}
		}
	}
};