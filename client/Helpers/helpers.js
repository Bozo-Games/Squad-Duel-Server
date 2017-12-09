let _mouseTransforms = [];
function pushMouse() {
	_mouseTransforms.push({x:mouseX,y:mouseY});
}
function popMouse() {
	if(_mouseTransforms.length > 0) {
		let mousePos = _mouseTransforms.pop();
		mouseX = mousePos.x;
		mouseY = mousePos.y;
	}
}
function translateMouse(xDelta,yDelta) {
	mouseX -= xDelta;
	mouseY -= yDelta;
}