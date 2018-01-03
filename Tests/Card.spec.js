
const assert = require('assert');
const defaults = require('../server/Old/Helpers/defaults.js');
const logger = require('../server/Old/Helpers/logger.js');
const Card = require('../server/Old/Models/Card.js');
describe('Card Model', function () {
	before(function() {
		logger.on = false;
	});
	it('should exist', function() {
		assert.ok(Card !== undefined)
	});
	it('should respond to toJSON()', function () {
		let c = new Card();
		assert.ok(typeof c.toJSON === 'function');
	});
	it('should have default values', function () {
		let a = new Card();
		assert.equal(a.id, -1);
		assert.equal(a.name, 'No Name');
		assert.equal(a.health, 0);
		assert.equal(a.armor, 0,'armor check');
		assert.equal(a.speed, 1);
		assert.equal(a.icon, 0);
		assert.equal(a.attacks.length, defaults.card.numberOfAttacks);
	});
	it('should accept a id in constructor', function () {
		let c = new Card({id:'abc123'});
		assert.ok(c.id === 'abc123');
	});
	it('should accept a name in constructor', function () {
		let c = new Card({name:'noName'});
		assert.ok(c.name === 'noName');
	});
	it('should accept a armor in constructor', function () {
		let c = new Card({armor:3});
		assert.ok(c.armor === 3);
	});
	it('should accept a health in constructor', function () {
		let c = new Card({health:4});
		assert.ok(c.health === 4);
	});
	it('should accept a icon in constructor', function () {
		let c = new Card({icon:3});
		assert.ok(c.icon === 3);
	});
	it('should return a JSON object with id, name, category, power and speed matching it\'s constructor', function () {
		let c = new Card({
			id:'abc123',
			name:'noName',
			icon:4,
			health:1,
			armor:2,
			speed:3,
			attacks: [{},{},{},{},{},{},{},{},{},{}]
		});
		let json = c.toJSON();
		assert.equal(json.id,'abc123','id check');
		assert.equal(json.name,'noName', 'name check');
		assert.equal(json.icon,4,'icon check');
		assert.equal(json.health,1, 'health check');
		assert.equal(json.armor,2, 'armor check');
		assert.equal(json.speed,3,'speed check');
		assert.equal(json.attacks.length,10,'attacks check');
	});
	it('should start in the inDeck state', function () {
		let c = new Card();
		assert.equal(c.currentState,'inDeck');
	});
	it('should move to in hand <x> state when dealt to player <x>', function () {
		let c = new Card();
		c.dealToPlayer();
		assert.equal(c.currentState,'inHand');
	});
	it('should respond to can select', function () {
		let c =  new Card();
		assert.equal(c.canSelect,false);
		c.dealToPlayer();
		assert.equal(c.canSelect,true);
		c.selectCard();
		assert.equal(c.canSelect,false);
	});
	it('should move to select a from in hand a when card is selected', function () {
		let c =  new Card();
		c.dealToPlayer();
		c.selectCard();
		assert.equal(c.currentState,'selected');
	});
	it('should move from select a to in hand a when returned to hand', function () {
		let c =  new Card();
		c.dealToPlayer();
		c.selectCard();
		c.returnToHand();
		assert.equal(c.currentState,'inHand');
	});
	it('should move from selected lockedIn when confirmed', function () {
		let c =  new Card();
		c.dealToPlayer();
		c.selectCard();
		c.confirm();
		assert.equal(c.currentState,'lockedIn');
	});
	it('should be dueling on button ', function () {
		let c =  new Card();
		c.dealToPlayer();
		c.selectCard();
		c.confirm();
		c.duel();
		assert.equal(c.currentState,'dueling');
	});
	it('should be killed on dueling is done ', function () {
		let c =  new Card();
		c.dealToPlayer();
		c.selectCard();
		c.confirm();
		c.duel();
		c.kill();
		assert.equal(c.currentState,'dead');
	});
	it('should be returned to Player x on dueling is done ', function () {
		let c =  new Card();
		c.dealToPlayer();
		c.selectCard();
		c.confirm();
		c.duel();
		c.returnToHand();
		assert.equal(c.currentState,'inHand');
	});
	it('should be able to find attack by id', function () {
		let c = new Card({
			attacks: [{id:'abc123'}]
		});
		let a = c.getAttackByID('abc123');
		assert.equal(a.id,'abc123');
		a = c.getAttackByID('none');
		assert.equal(a,undefined);

	});
});