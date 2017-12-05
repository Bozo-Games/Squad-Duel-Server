const data ={
	characterClasses: {
        Knight:    {health: 10, armor: 5, speed: 1},
     	Samuari:   {health: 10, armor: 3, speed: 3},
    	Thief:     {health: 10, armor: 0, speed: 5},
    	Monk:      {health: 12, armor: 0, speed: 4},
        Guard:     {health: 14, armor: 2, speed: 2},
    	Raider:    {health: 15, armor: 1, speed: 2},
    	Barbarian: {health: 15, armor: 2, speed: 1},
        Ranger:    {health: 16, armor: 0, speed: 2},
    	Troll:     {health: 20, armor: 0, speed: 1}
    },
    characterTitles: {
    	Blood:         {health: 5, armor: 0,  speed: 0},
    	Armored:       {health: 0, armor: 3,  speed: 0},
        Nomadic:       {health: 1, armor: 0,  speed: 2},
    	Fairy:         {health: 1, armor: -1, speed: 3},
    	Dark:          {health: 0, armor: 4,  speed: -1},
        Lumbering:     {health: 7, armor: 0,  speed: -1}, 
    	Adventuring:   {health: 1, armor: 1,  speed: 1}
    }
};
module.exports = data;