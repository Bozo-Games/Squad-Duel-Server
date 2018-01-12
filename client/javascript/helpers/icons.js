let icons = {
	loading: undefined,
	loadedCount: 0,
	getCharacter: function (name,loop,frameNumber = frameCount) {
		let img = icons.character[name][loop][frameNumber % icons.character[name][loop].length];
		if (img.name !== 'p5.Image') {
			loadCharacterAssets(icons.character[name]);
			img = icons.loading;
		}
		return img;
	},
	stats: {
		health:'./Assets/icons/health.svg',
		armor: './Assets/icons/armor.svg',
		speed: './Assets/icons/speed.svg',
		power: './Assets/icons/power.svg',
	},
	field: {
		grass: './Assets/field/grass.png',
		sand: './Assets/field/sand.png',
		dirt: './Assets/field/dirt.png',
	},
	character: {
		"Knight": {
			idle: [
				'./Assets/Character/Knight/idle/0.png',
				'./Assets/Character/Knight/idle/1.png',
				'./Assets/Character/Knight/idle/2.png',
				'./Assets/Character/Knight/idle/3.png',
				'./Assets/Character/Knight/idle/4.png',
				'./Assets/Character/Knight/idle/5.png',
				'./Assets/Character/Knight/idle/6.png',
				'./Assets/Character/Knight/idle/7.png',
				'./Assets/Character/Knight/idle/8.png',
				'./Assets/Character/Knight/idle/9.png',
				'./Assets/Character/Knight/idle/10.png',
				'./Assets/Character/Knight/idle/11.png',
				'./Assets/Character/Knight/idle/12.png',
				'./Assets/Character/Knight/idle/13.png',
				'./Assets/Character/Knight/idle/14.png',
				'./Assets/Character/Knight/idle/15.png',
			],
			walk: [
				'./Assets/Character/Knight/walk/0.png',
				'./Assets/Character/Knight/walk/1.png',
				'./Assets/Character/Knight/walk/2.png',
				'./Assets/Character/Knight/walk/3.png',
				'./Assets/Character/Knight/walk/4.png',
				'./Assets/Character/Knight/walk/5.png',
				'./Assets/Character/Knight/walk/6.png',
				'./Assets/Character/Knight/walk/7.png',
				'./Assets/Character/Knight/walk/8.png',
				'./Assets/Character/Knight/walk/9.png',
				'./Assets/Character/Knight/walk/10.png',
				'./Assets/Character/Knight/walk/11.png',
				'./Assets/Character/Knight/walk/12.png',
				'./Assets/Character/Knight/walk/13.png',
				'./Assets/Character/Knight/walk/14.png',
				'./Assets/Character/Knight/walk/15.png',
			],
			run: [
				'./Assets/Character/Knight/run/0.png',
				'./Assets/Character/Knight/run/1.png',
				'./Assets/Character/Knight/run/2.png',
				'./Assets/Character/Knight/run/3.png',
				'./Assets/Character/Knight/run/4.png',
				'./Assets/Character/Knight/run/5.png',
				'./Assets/Character/Knight/run/6.png',
				'./Assets/Character/Knight/run/7.png',
				'./Assets/Character/Knight/run/8.png',
				'./Assets/Character/Knight/run/9.png',
				'./Assets/Character/Knight/run/10.png',
				'./Assets/Character/Knight/run/11.png',
				'./Assets/Character/Knight/run/12.png',
				'./Assets/Character/Knight/run/13.png',
				'./Assets/Character/Knight/run/14.png',
				'./Assets/Character/Knight/run/15.png',
			],
			attack: [
				'./Assets/Character/Knight/attack/0.png',
				'./Assets/Character/Knight/attack/1.png',
				'./Assets/Character/Knight/attack/2.png',
				'./Assets/Character/Knight/attack/3.png',
				'./Assets/Character/Knight/attack/4.png',
				'./Assets/Character/Knight/attack/5.png',
				'./Assets/Character/Knight/attack/6.png',
				'./Assets/Character/Knight/attack/7.png',
				'./Assets/Character/Knight/attack/8.png',
				'./Assets/Character/Knight/attack/9.png',
				'./Assets/Character/Knight/attack/10.png',
				'./Assets/Character/Knight/attack/11.png',
			],
			block: [
				'./Assets/Character/Knight/block/0.png',
				'./Assets/Character/Knight/block/1.png',
				'./Assets/Character/Knight/block/2.png',
				'./Assets/Character/Knight/block/3.png',
				'./Assets/Character/Knight/block/4.png',
				'./Assets/Character/Knight/block/5.png',
				'./Assets/Character/Knight/block/6.png',
				'./Assets/Character/Knight/block/7.png',
				'./Assets/Character/Knight/block/8.png',
				'./Assets/Character/Knight/block/9.png',
				'./Assets/Character/Knight/block/10.png',
				'./Assets/Character/Knight/block/11.png',
			],
			die: [
				'./Assets/Character/Knight/die/0.png',
				'./Assets/Character/Knight/die/1.png',
				'./Assets/Character/Knight/die/2.png',
				'./Assets/Character/Knight/die/3.png',
				'./Assets/Character/Knight/die/4.png',
				'./Assets/Character/Knight/die/5.png',
				'./Assets/Character/Knight/die/6.png',
				'./Assets/Character/Knight/die/7.png',
				'./Assets/Character/Knight/die/8.png',
				'./Assets/Character/Knight/die/9.png',
				'./Assets/Character/Knight/die/10.png',
				'./Assets/Character/Knight/die/11.png',
			],
			dead: './Assets/Character/Knight/die/11.png',
		},
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