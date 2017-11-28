class Player {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.socketID = json.socketID;
        this.name = json.name;
    }
    toJSON() {
        return {
            socketID: this._socketID,
            status: this.status,
            name: this.name
        }
    }
    draw(height, width, isPlayer) {
        push();
        let n = this.name === undefined ? 'undefined' : this.name;
        if (isPlayer) {

            fill('#0000ff');
        } else {
            fill('#ff0000');
        }
        translate(0,20);
        textStyle(BOLD);
        textSize(17);
        text(n, 0, 0);
        pop();
    }
    get isMe() {
        return this.socketID === socket.id;
    }
}