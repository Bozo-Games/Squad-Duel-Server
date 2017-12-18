defaults.card = {
	inHand: {
        iconScale:0.4,
		strokeWeight: 3,
	},
	duel: {
		player: {
			statBoxScale: {
				x: 0.05,
				y: 0,
				w: 0.15,
				h: 0.6,
			},
			characterScale: {
				x: 0.125,
				y: 0,
				w: 1, //uses H to be square
				h: 1,
			},
			attackScale: {
				x: 0.45,
				y: 0,
				w: 0.5,
				h: 1//calculated based on number of attacks
			}
		},
		opp: {
			statBoxScale: {
				x: 0.825,
				y: 0,
				w: 0.125,
				h: 0.5,
			},
			characterScale: {
				x: 0.5,
				y: 0,
				w: 1, //uses H to be square
				h: 1,
			},
			attackScale: {
				x: 0.05,
				y: 0,
				w: 0.5,
				h: 1//calculated based on number of attacks
			}
		}
	}
};