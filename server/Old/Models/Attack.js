
class Attack {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.id = json.id === undefined ? undefined : json.id;
        this.category = json.category === undefined ? 'unknown' : json.category;
        this.power = json.power === undefined ? 0 : json.power;
	    this.speed = json.speed === undefined ? 0 : json.speed;
        this.name = json.name === undefined ? 'unknown' : json.name;
    }
    toJSON(){
        return {
            id: this.id,
            category: this.category,
            power: this.power,
            speed: this.speed,
            name: this.name,
        };
    }
}
module.exports = Attack;