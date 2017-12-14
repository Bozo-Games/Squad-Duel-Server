
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
function scaleMouse(xScale,yScale) {
	if(xScale === 0 || yScale === 0) {
		mouseX = NaN;
		mouseY = NaN;
		return;
	}
	mouseX = mouseX/xScale;
	mouseY = mouseY/yScale;
}