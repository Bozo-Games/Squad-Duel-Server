class Player {
	constructor(json) {
		json = json === undefined ? {} : json;
		this.letter = json.letter ===  undefined ? 'A' : json.letter;
		this.socketID = json.socketID;
	}
	get json() {
		return  {
			letter: this.letter,
			socketID: this.socketID,
		}
	}
	get isFilled() {
		return this.socketID !== undefined;
	}
}

module.exports = Player;