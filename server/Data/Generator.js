let generator = {
	archetypes: [
		{name:'Knight'      ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Barbarian'   ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Assassin'    ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Guard'       ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Hunter'      ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Lord'        ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Templar'     ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Smith'       ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Shaman'      ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Priest'      ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5}
	],
	titles: [ //Feel Free to change the names
		{name:'Arcane'      ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Divine'      ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Dark'        ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Air'         ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Earth'       ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
		{name:'Water'       ,health:10  ,armor:0    ,power:2    ,speed:1    ,stamina:5},
	],
	abilities: [ //* means available to all, otherwise put the title and or archetypes which can use these abilities
		{name:'Slash'       ,power:5    ,speed:5    ,stamina:1  ,category:'basic'   ,availability:['*']},
		{name:'Smash'       ,power:5    ,speed:5    ,stamina:1  ,category:'crush'   ,availability:['*']},
		{name:'Stab'        ,power:5    ,speed:5    ,stamina:1  ,category:'pierce'  ,availability:['*']},
		{name:'Bless'       ,power:5    ,speed:5    ,stamina:1  ,category:'heal'    ,availability:['Priest','Divine']},
		//am repeating but Xander could fill these out
		{name:'Slash 2'     ,power:5    ,speed:5    ,stamina:1  ,category:'basic'   ,availability:['*']},
		{name:'Smash 2'     ,power:5    ,speed:5    ,stamina:1  ,category:'crush'   ,availability:['*']},
		{name:'Stab 2'      ,power:5    ,speed:5    ,stamina:1  ,category:'pierce'  ,availability:['*']},
		{name:'Slash 3'     ,power:5    ,speed:5    ,stamina:1  ,category:'basic'   ,availability:['*']},
		{name:'Smash 3'     ,power:5    ,speed:5    ,stamina:1  ,category:'crush'   ,availability:['*']},
		{name:'Stab 3'      ,power:5    ,speed:5    ,stamina:1  ,category:'pierce'  ,availability:['*']},
	],
	benchAbilities: [
		{name:'recover'     ,power:5    ,speed:5    ,stamina:1  ,availability:['*']},
		{name:'distract'    ,power:5    ,speed:5    ,stamina:1  ,availability:['*']},
		{name:'shoot'       ,power:5    ,speed:5    ,stamina:1  ,availability:['*']},

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
/*
Array.prototype.toJSON = function() {
	let json = [];
	for(let e of this) {
		if(e.hasOwnProperty('json')) {
			json.push(e.json);
		} else if (Array.isArray(e)) {
			json.push(e.toJSON());
		} else {
			json.push(JSON.stringify(e))
		}
	}
	return json;
};*/

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