defaults.card = {
	inHand: {
        iconScale:0.4,
		strokeWeight: 3,
		animationTimes: {
        	moveOff:400,
			moveIn:400
		}
	},
	duelCharacter: {
		animationTimes: {
			walkIn:800,
			turn:200,
			walkOut:800,
			jump:1200,
			runToAttack:700,
			attackHoldTimeRoot: 500,
		}
	},
	duelStats: {
		animationTimes: {
			show:800,
			hide:400,
			pauseTime: 600,
		}
	},
	//TODO clean this up and make better
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