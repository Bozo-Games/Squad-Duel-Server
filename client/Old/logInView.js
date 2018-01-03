let logInDiv;
let input;
let logInBtn;
function createLogInView() {
	logInDiv = createDiv("");
	logInDiv.position(width*0.25,height*0.5-width*0.05-10);
	logInDiv.size(width*0.5,width*0.1+110);
	logInDiv.class('logInOverlay');

	input = createInput("user name","text");
	input.position(width*0.05,width*0.05);
	input.size(width*0.4,50);
	input.parent(logInDiv);

	input.input(logInInputEvent);

	logInBtn = createButton("Join Game");
	logInBtn.position(width*0.05,width*0.1+50);
	logInBtn.size(width*0.4,50);
	logInBtn.parent(logInDiv);

	logInBtn.touchEnded(logInUser);
}
function hideLogInView() {
	logInDiv.remove();
}
function showLogInView() {

}
function logInUser() {
	network.logIn(input.value());
}
function logInInputEvent() {
	return true;
}