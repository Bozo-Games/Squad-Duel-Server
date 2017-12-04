const data ={
	characterClasses: {
        Knight: {health: 10, armor: 5, speed: -1},
    	Guard: {health: 10, armor: 2, speed: 2},
    	Thief: {health: 10, armor: 0, speed: 5},
    	Monk: {health: 12, armor: 0, speed: 3},
    	Ranger: {health: 16, armor: 0, speed: 1},
    	Barbarian: {health: 16, armor: 1, speed: 0},
    	Troll: {health: 20, armor: 1, speed: 0}
    },
    characterTitles: {
    	Blood: {health: 5, armor: 0, speed: 0},
    	Armored: {health: 0, armor: 2, speed: 0},
    	Fairy: {health: 0, armor: -1, speed: 3},
    	Dark: {health: 0, armor: 3, speed: -1},
    	Adventuring: {health: 1, armor: 1, speed: 1}
    }
};
module.exports = data;