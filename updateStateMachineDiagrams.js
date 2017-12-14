const fs = require('fs');
const cmd=require('node-cmd');
const visualize = require('javascript-state-machine/lib/visualize');
const logs = require('./server/Helpers/logger.js');
const Player = require('./server/Models/Player.js');
const Game = require('./server/Models/Game.js');
const Duel = require('./server/Models/Duel.js');
const Card = require('./server/Models/Card.js');
const Attack = require('./server/Models/Attack.js');
logs.on=false;
/*
let p = new Player();
fs.writeFile("./StateMachineDiagrams/dotFiles/Player.dot", visualize(p._stateMachine), function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("Player Diagram saved!");
});
cmd.run('dot -Tpng ./StateMachineDiagrams/dotFiles/Player.dot > ./StateMachineDiagrams/Player.png');
*/
let g = new Game();
fs.writeFile("./StateMachineDiagrams/dotFiles/Game.dot", visualize(g._stateMachine), function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("Game Diagram saved!");
});
cmd.run('dot -Tpng ./StateMachineDiagrams/dotFiles/Game.dot > ./StateMachineDiagrams/Game.png');

let d = new Duel();
fs.writeFile("./StateMachineDiagrams/dotFiles/Duel.dot", visualize(d._stateMachine), function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("Duel Diagram saved!");
});
cmd.run('dot -Tpng ./StateMachineDiagrams/dotFiles/Duel.dot > ./StateMachineDiagrams/Duel.png');

let c = new Card();
fs.writeFile("./StateMachineDiagrams/dotFiles/Card.dot", visualize(c._stateMachine), function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("Card Diagram saved!");
});
cmd.run('dot -Tpng ./StateMachineDiagrams/dotFiles/Card.dot > ./StateMachineDiagrams/Card.png');
/*
let a = new Attack();
fs.writeFile("./StateMachineDiagrams/dotFiles/Attack.dot", visualize(a._stateMachine), function(err) {
	if(err) {
		return console.log(err);
	}
	console.log("Card Diagram saved!");
});
cmd.run('dot -Tpng ./StateMachineDiagrams/dotFiles/Attack.dot > ./StateMachineDiagrams/Attack.png');
*/