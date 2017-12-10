let icons = {
	loadedCount: 0
};

function loadAssets(toLoad) {
	let keys = Object.keys(toLoad);
	for(let k = 0; k < keys.length;k++ ) {
		let key = keys[k];
		let obj = toLoad[key];
		if(obj.constructor.name === 'String') {
			if(localStorage.getItem(toLoad[key]) === null) {
				loadImage(toLoad[key],function(img){
					console.log('loading');
					toLoad[key] = img;
					localStorage.setItem(toLoad[key],img);
					icons.loadedCount++;
				});
			} else {
				let img = localStorage.getItem(toLoad[key]);
				icons.loadedCount++;
			}
		} else if(obj.constructor.name === 'Array' || obj.constructor.name === 'Object'  ) {
			toLoad[key] = loadAssets(obj);
		}
	}
	return toLoad;
}