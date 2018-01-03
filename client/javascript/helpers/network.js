class Network {
	constructor() {
		this.socket = io();
		this.socket.on('debug',this._debug);
	}
	_debug(msg) {
		console.log(msg);
	}
	debug(msg) {
		this.socket.emit('debug',msg);
	}
	sendMouseInput(mx,my) {
		this.socket.emit('give input',{x:mx,y:my});
	}
}