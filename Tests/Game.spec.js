
const assert = require('assert');
const defaults = require('../server/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Game = require('../server/Models/Game.js');
const Player = require('../server/Models/Player.js');
describe('Game Model', function () {
	before(function () {
		logger.on = false;
	});
	it('should exist', function () {
		assert.ok(Game !== undefined)
	});
	it('should respond to toJSON()', function () {
		let g = new Game();
		assert.ok(typeof g.toJSON === 'function');
	});
	it('should start in state, new game',function () {
		let g = new Game();
		assert.equal(g.currentState, 'newGame');
	});
	it('should be able to validate player', function () {
		let g = new Game();
		assert.equal(g._validatePlayer(undefined),false,'undefined');
		assert.equal(g._validatePlayer(new Player()),false, 'blank');
		assert.equal(g._validatePlayer(new Player({socketID:'abc123'})),true,'valid');
	});
	it('should not add an invalid player', function () {
		let g = new Game();
		assert.equal(false,g.playerJoin(undefined));
		assert.equal(g.currentState, 'newGame');
		assert.equal(false,g.playerJoin(new Player()));
	});
	it('should add a valid player', function () {
		let g = new Game();
		assert.equal(g.playerJoin(new Player({socketID:'abc123'})),false,'state transaction happened');
		assert.equal(g.currentState, 'newGame');
		assert.equal(g.playerJoin(new Player({socketID:'def456'})),true,'state transaction happened 2');
		assert.equal(g.currentState, 'cardSelectingStage');
	});
	it('should allow a player to leave', function () {
		let g = new Game();
		assert.equal(g.playerJoin(new Player({socketID:'abc123'})),false,'player a join');
		assert.equal(g.currentState, 'newGame');
		assert.equal(g.playerLeave(new Player({socketID:'abc123'})),true,'player a leave');
		assert.equal(g.currentState, 'endGame');
		g = new Game();
		assert.equal(g.playerJoin(new Player({socketID:'abc123'})),false,'player a join');
		assert.equal(g.playerJoin(new Player({socketID:'def456'})),true,'player b join');
		assert.equal(g.playerLeave(new Player({socketID:'abc123'})),true,'player a leave');
		assert.equal(g.currentState, 'endGame');
		assert.equal(g.playerLeave(new Player({socketID:'def456'})),true,'player b leave');
		assert.equal(g.currentState, 'endGame','end in correct state');
	});
	it('should deal out cards when both players have joined the game',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.currentState, 'cardSelectingStage', 'in card select stage');
		assert.equal(g.handA.cards.length, defaults.hand.numberOfCards);
		assert.equal(g.handB.cards.length, defaults.hand.numberOfCards);
	});
	it('should allow a player to select cards in their hand',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		let handA = g.handA;
		let handB = g.handB;
		assert.equal(g.selectCard('abc123',handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		assert.equal(g.currentState, 'cardSelectingStage', 'state check');
		handA.cards[0].confirm();
		handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
	});
	it('should not allow a player to select a card not in their hand',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		let handA = g.handA;
		let handB = g.handB;
		assert.equal(g.selectCard('abc123',handB.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA, undefined,'card not selected check');
		assert.equal(g.handB.cards[0].currentState, 'inHand','card state check');
	});
	it('should allow a player to select an attack from the card they selected', function(){
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.selectCard('abc123',g.handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, g.handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, g.handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		g.handA.cards[0].confirm();
		g.handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
		g.duel.cardA.attacks[0].id = "new-attack-id";
		assert.equal(g.selectAttack('abc123',g.duel.cardA.attacks[0].id),false,'player A selects attack');
		assert.equal(g.duel.attackA.id, 'new-attack-id');
	});
	it('should not allow the player to select nd attack not on the card', function() {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.selectCard('abc123',g.handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, g.handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, g.handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		g.handA.cards[0].confirm();
		g.handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
		assert.equal(g.selectAttack('abc123','bad-id'),false,'player A selects invalid attack');
		assert.equal(g.duel.attackA, undefined);
	});
	it('should get Ready to button',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.selectCard('abc123',g.handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, g.handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, g.handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		g.handA.cards[0].confirm();
		g.handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
		g.duel.cardA.attacks[0].id = "new-attack-id";
		assert.equal(g.selectAttack('abc123',g.duel.cardA.attacks[0].id),false,'player A selects attack');
		assert.equal(g.duel.attackA.id, 'new-attack-id');
		g.duel.cardB.attacks[0].id = "new-attack-id-2";
		assert.equal(g.selectAttack('edf456',g.duel.cardB.attacks[0].id),true,'player B selects attack');
		assert.equal(g.duel.attackB.id, 'new-attack-id-2');
		assert.equal(g.currentState,'readyToDuel');
		assert.equal(g.duel.currentState,'ready');
	});

	it('should get process to button',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.selectCard('abc123',g.handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, g.handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, g.handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		g.handA.cards[0].confirm();
		g.handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
		g.duel.cardA.attacks[0].id = "new-attack-id";
		assert.equal(g.selectAttack('abc123',g.duel.cardA.attacks[0].id),false,'player A selects attack');
		assert.equal(g.duel.attackA.id, 'new-attack-id');
		g.duel.cardB.attacks[0].id = "new-attack-id-2";
		assert.equal(g.selectAttack('edf456',g.duel.cardB.attacks[0].id),true,'player B selects attack');
		assert.equal(g.duel.attackB.id, 'new-attack-id-2');
		assert.equal(g.currentState,'readyToDuel');
		assert.equal(g.duel.currentState,'ready');

		assert.equal(g.processDuel(),true,'processing button');
		assert.equal(g.currentState,'showingDuelResults');
	});
	it('should be able to continue the game',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.selectCard('abc123',g.handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, g.handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, g.handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		g.handA.cards[0].confirm();
		g.handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
		g.duel.cardA.attacks[0].id = "new-attack-id";
		assert.equal(g.selectAttack('abc123',g.duel.cardA.attacks[0].id),false,'player A selects attack');
		assert.equal(g.duel.attackA.id, 'new-attack-id');
		g.duel.cardB.attacks[0].id = "new-attack-id-2";
		assert.equal(g.selectAttack('edf456',g.duel.cardB.attacks[0].id),true,'player B selects attack');
		assert.equal(g.duel.attackB.id, 'new-attack-id-2');
		assert.equal(g.currentState,'readyToDuel');
		assert.equal(g.duel.currentState,'ready');
		assert.equal(g.processDuel(),true,'processing button');
		assert.equal(g.continueGame(),true,'continue game');
		assert.equal(g.duel.currentState,'waitingForCards');
		assert.equal(g.handA.cards[0].currentState,'inHand');
		assert.equal(g.handB.cards[0].currentState,'inHand');
	});

	it('should not be able to continue but instead declare the victor the game if all the cards for a player are dead',function () {
		let g = new Game();
		let playerA = new Player({socketID:'abc123',name:'Player A'});
		let playerB = new Player({socketID:'edf456',name:'Player B'});
		assert.equal(g.playerJoin(playerA),false,'player A join');
		assert.equal(g.playerJoin(playerB),true,'player B join');
		assert.equal(g.selectCard('abc123',g.handA.cards[0].id),false,'player A selects card');
		assert.equal(g.duel.cardA.id, g.handA.cards[0].id,'id card check');
		assert.equal(g.duel.cardA.currentState, 'selected','card state check');
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),false,'player B selects card');
		assert.equal(g.duel.cardB.id, g.handB.cards[0].id,'id card check');
		assert.equal(g.duel.cardB.currentState, 'selected','card state check');
		g.handA.cards[0].confirm();
		g.handB.cards[0].confirm();
		assert.equal(g.selectCard('edf456',g.handB.cards[0].id),true,'player B selects card');
		assert.equal(g.currentState, 'attackSelectStage', 'state check');
		g.duel.cardA.attacks[0].id = "new-attack-id";
		assert.equal(g.selectAttack('abc123',g.duel.cardA.attacks[0].id),false,'player A selects attack');
		assert.equal(g.duel.attackA.id, 'new-attack-id');
		g.duel.cardB.attacks[0].id = "new-attack-id-2";
		assert.equal(g.selectAttack('edf456',g.duel.cardB.attacks[0].id),true,'player B selects attack');
		assert.equal(g.duel.attackB.id, 'new-attack-id-2');
		assert.equal(g.currentState,'readyToDuel');
		assert.equal(g.duel.currentState,'ready');
		assert.equal(g.processDuel(),true,'processing button');
		//hacky to get all cards dead
		g.handA.cards[0].health = -10;
		g.handA.cards[1].selectCard();
		g.handA.cards[1].confirm();
		g.handA.cards[1].duel();
		g.handA.cards[1].health = -10;
		g.handA.cards[2].selectCard();
		g.handA.cards[2].confirm();
		g.handA.cards[2].duel();
		g.handA.cards[2].health = -10;

		assert.equal(g.continueGame(),true,'declares vitcor');
		assert.equal(g.currentState,'endGame');
		assert.equal(g.duel.currentState,'waitingForCards');
		assert.equal(g.handA.cards[0].currentState,'dead');
		assert.equal(g.handB.cards[0].currentState,'inHand');
	});



});