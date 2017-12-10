let icons = {
	loadedCount: 0
};

function loadAssets(toLoad) {
	let keys = Object.keys(toLoad);
	for(let k = 0; k < keys.length;k++ ) {
		let key = keys[k];
		let obj = toLoad[key];
		if(obj.constructor.name === 'String') {
			toLoad[key] = loadImage(toLoad[key],function(img) {
				console.log('loading');
				icons.loadedCount++;
			});
		} else if(obj.constructor.name === 'Array' || obj.constructor.name === 'Object'  ) {
			toLoad[key] = loadAssets(obj);
		}
	}
	return toLoad;
}