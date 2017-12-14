const data ={
	characterClasses: {
		Guard:     {health: 12, armor: 1, speed: 1, power:0 }, //1
		Thief:     {health: 12, armor: 0, speed: 3, power:0 }, //2
		Monk:      {health: 12, armor: 1, speed: 2, power:0 }, //2
		Solder:    {health: 12, armor: 3, speed: 1, power:0 }, //3
		Ranger:    {health: 14, armor: 2, speed: 2, power:0 }, //3
		Pirate:    {health: 14, armor: 0, speed: 3, power:0 }, //3
		Paladin:   {health: 14, armor: 3, speed: 2, power:0 }, //4
		Knight:    {health: 16, armor: 3, speed: 2, power:0 }, //4
		Barbarian: {health: 16, armor: 2, speed: 3, power:0 }, //4
		Troll:     {health: 18, armor: 4, speed: 1, power:0 }  //4
	},
	characterTitles: {
		Berserker:     {health: -6, armor: 0,  speed: 5, power:0},
		Phantom:       {health:  0, armor: 3,  speed: 2, power:0},
		Adventuring:   {health:  2, armor: 1,  speed: 2, power:0},
		Blood:         {health:  4, armor: 1,  speed: 1, power:0},
		Dark:          {health:  1, armor: 4,  speed: 1, power:0},
		Armored:       {health:  0, armor: 6,  speed: 0, power:0}
	}
};
module.exports = data;