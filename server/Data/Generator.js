let generator = {
	archetypes: [
		{name:'Knight'      ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Barbarian'   ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Assassin'    ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Guard'       ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Hunter'      ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Lord'        ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Templar'     ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Smith'       ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Shaman'      ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Priest'      ,health:10  ,armor:0    ,power:2    ,speed:1}
	],
	titles: [
		{name:'Arcane'      ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Divine'      ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Dark'        ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Air'         ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Earth'       ,health:10  ,armor:0    ,power:2    ,speed:1},
		{name:'Water'       ,health:10  ,armor:0    ,power:2    ,speed:1},
	],
	abilities: [
		{name:'Slash'       ,power:5    ,speed:5    ,category:'basic'   ,availability:['*']},
		{name:'Smash'       ,power:5    ,speed:5    ,category:'crush'   ,availability:['*']},
		{name:'Stab'        ,power:5    ,speed:5    ,category:'pierce'  ,availability:['*']}
	],
	guid: function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4();
	}
};

Array.prototype.inArray = function(comparer) {
	for(var i=0; i < this.length; i++) {
		if(comparer(this[i])) return true;
	}
	return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
	if (!this.inArray(comparer)) {
		this.push(element);
	}
};
Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};
module.exports = generator;