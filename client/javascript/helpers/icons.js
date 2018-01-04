let icons = {
	loading: undefined,
	loadedCount: 0,
	getCharacter: function (name,loop,offset = 0) {
		let img = icons.card[name][loop][(frameCount+offset) % icons.card[name][loop].length];
		if (img.name !== 'p5.Image') {
			loadCharacterAssets(icons.card[name]);
			img = icons.loading;
		}
		return img;
	},
	field: {
		grass: './Assets/field/grass.png',
		sand: './Assets/field/sand.png',
		dirt: './Assets/field/dirt.png',
	}
};

function loadAssets(toLoad) {
	if(toLoad.idle === undefined) {
		let keys = Object.keys(toLoad);
		for (let k = 0; k < keys.length; k++) {
			let key = keys[k];
			let obj = toLoad[key];
			if (obj.name !== 'p5.Image') {
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
	}
	return toLoad;
}

function loadCharacterAssets(toLoad) {
	let keys = Object.keys(toLoad);
	for (let k = 0; k < keys.length; k++) {
		let key = keys[k];
		let obj = toLoad[key];
		if (obj.name !== 'p5.Image') {
			if (obj.constructor.name === 'String') {
				toLoad[key] = icons.loading;
				loadImage(obj, function (img) {
					toLoad[key] = img;
					icons.loadedCount++;
				});
			} else if (obj.constructor.name === 'Array' || obj.constructor.name === 'Object') {
				toLoad[key] = loadCharacterAssets(obj);
			}
		}
	}
	return toLoad;
}