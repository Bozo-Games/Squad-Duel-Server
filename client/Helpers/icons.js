let icons = {
	loading: undefined,
	loadedCount: 0
};


function loadAssets(toLoad) {
	let keys = Object.keys(toLoad);
	for(let k = 0; k < keys.length;k++ ) {
		let key = keys[k];
		let obj = toLoad[key];
		if(obj.name !== 'p5.Image') {
			if (obj.constructor.name === 'String') {
				toLoad[key] = icons.loading;
				loadImage(obj, function (img) {
					toLoad[key] = img;
					icons.loadedCount++;
				});
			} else if (obj.constructor.name === 'Array' || obj.constructor.name === 'Object') {
				toLoad[key] = loadAssets(obj);
			}
		}

	}
	return toLoad;
}