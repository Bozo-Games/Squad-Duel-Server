let icons = {

};

function loadAssets(toLoad) {
	console.log('~~~~~~~~~~~')
	let keys = Object.keys(toLoad);
	for(let k = 0; k < keys.length;k++ ) {
		let key = keys[k];
		let obj = toLoad[key];
		console.log(`${k} -> ${key} -> ${obj}`);
		if(obj.constructor.name === 'String') {
			toLoad[key] = loadImage(toLoad[key]);
		} else if(obj.constructor.name === 'Array' || obj.constructor.name === 'Object'  ) {

			toLoad[key] = loadAssets(obj);
		}
	}
	return toLoad;
}