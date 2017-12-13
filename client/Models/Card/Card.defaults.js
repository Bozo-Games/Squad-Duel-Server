defaults.card = {
	inHand: {
		iconScale:0.4,
		strokeWeight: 3,
	},
	duel: {
		player: {
			scale: {
				x: 0.125,
				y: 0.5,
				w: 1,
				h: 0.5,
			},
			characterScale: {
				x: 0.125,
				y: 0,
				w: 1, //uses H to be square
				h: 1,
			},
			attackScale: {
				x: 0.6,
				y: 0,
				w: 0.6,
				h: 1//calculated based on number of attacks
			}
		}
	}
};