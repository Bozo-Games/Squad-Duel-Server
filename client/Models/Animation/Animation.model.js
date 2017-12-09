class Animation {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.scale= json.scale === undefined ? {x:0,y:0} : json.scale
		this.scale.x =  json.scale.x
	}
	update() {

	}
}