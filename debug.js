const fs = require('fs');
const cardDB = require('./server/Data/Card.js');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let classNames = Object.keys(cardDB.characterClasses);
let titleNames = Object.keys(cardDB.characterTitles);
let loops = [
	{name:'idle'  ,count:16},
	{name:'walk'  ,count:16},
	{name:'run'   ,count:16},
	{name:'attack',count:12},
	{name:'block' ,count:12},
	{name:'die'   ,count:12}];
let options = [];
for(let i = 1; i < 31; i++) {
	options.push({i:i,g:'male'})
	options.push({i:i,g:'female'})
}
for(let ti = 0; ti < titleNames.length; ti++) {
	for(let ci = 0; ci < classNames.length; ci++) {
		let i = Math.floor(Math.random()*options.length);
		let option = options[i];
		console.log(`"${titleNames[ti]} ${classNames[ci]}": {`);

		if (!fs.existsSync(`./client/Assets/icons/card/character/${titleNames[ti]}_${classNames[ci]}`)){
			fs.mkdirSync(`./client/Assets/icons/card/character/${titleNames[ti]}_${classNames[ci]}`);
		}
		for(let li = 0; li < loops.length; li++) {
			let loop = loops[li];
			console.log(`\t${loop.name}: [`);
			for(let j = 0; j < loop.count;j++) {
				console.log(`\t\t'./Assets/icons/card/character/${titleNames[ti]}_${classNames[ci]}/${loop.name}/${j}.png',`);
				if (!fs.existsSync(`./client/Assets/icons/card/character/${titleNames[ti]}_${classNames[ci]}/${loop.name}`)){
					fs.mkdirSync(`./client/Assets/icons/card/character/${titleNames[ti]}_${classNames[ci]}/${loop.name}`);
				}
				fs.rename(
					`./temp/hero_${option.i}/${option.g}/${li+1}_${loop.name}/${j+1}.png`,
					`./client/Assets/icons/card/character/${titleNames[ti]}_${classNames[ci]}/${loop.name}/${j}.png`,
					function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});
			}
			console.log(`\t]`);
		}
		setTimeout(function () {

		},5000);
		options.splice(i,1);
	}
}