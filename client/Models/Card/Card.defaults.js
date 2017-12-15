defaults.card = {
	inHand: {
		iconScale:0.4,
		strokeWeight: 3,
	},
	duel: {
		player: {
			scale: {
				x: 0.1,
				y: 0.5,
				w: 1,
				h: 0.5,
			},
			statBoxScale: {
				x: 0.025,
				y: 0,
				w: 0.15,
				h: 0.5,
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
			scale: {
				x: 0.125,
				y: 0.5,
				w: 1,
				h: 0.5,
			},
			statBoxScale: {
				x: 0.05,
				y: 0,
				w: 0.125,
				h: 0.5,
			},
			characterScale: { //not sure this is usefull am doing other things when drawing but are here so ...
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