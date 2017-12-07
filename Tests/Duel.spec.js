"use strict";
const assert = require('assert');
const defaults = require('../client/duel/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Duel = require('../server/Models/Duel.js');
const Card = require('../server/Models/Card.js');
describe('Duel Model', function () {
	before(function () {
		logger.on = false;
	});
	it('should exist', function () {
		assert.ok(Duel !== undefined)
	});
	it('should respond to toJSON()', function () {
		let d = new Duel();
		assert.ok(typeof d.toJSON === 'function');
	});
	it('should should accept cards, and attacks in constructor', function () {
		let d = new Duel({
			cardA:{id:'ca'},
			cardB:{id:'cb'},
			attackA:{id:'aa'},
			attackB:{id:'ab'},});
		assert.equal(d.cardA.id, 'ca');
		assert.equal(d.cardB.id, 'cb');
		assert.equal(d.attackA.id, 'aa');
		assert.equal(d.attackB.id, 'ab');
	});
	it('should should return cards, and attacks in json', function () {
		let d = new Duel({
			cardA:{id:'ca'},
			cardB:{id:'cb'},
			attackA:{id:'aa'},
			attackB:{id:'ab'}});
		let json = d.toJSON();
		assert.equal(json.cardA.id, 'ca');
		assert.equal(json.cardB.id, 'cb');
		assert.equal(json.attackA.id, 'aa');
		assert.equal(json.attackB.id, 'ab');
	});
	it('should should be able to return undefineds', function () {
		let d = new Duel();
		let json = d.toJSON();
		assert.equal(json.cardA, undefined);
		assert.equal(json.cardB, undefined);
		assert.equal(json.attackA, undefined);
		assert.equal(json.attackB, undefined);
	});
	it('should start in the state waiting for cards', function () {
		let d = new Duel();
		assert(d.currentState, 'waitingForCards');
	});
	it('should allow both cards to be slected with out moving to attack stage', function () {
		let d = new Duel();
		let ca = new Card({id:'abc123'});
		ca.dealToPlayer();
		let cb = new Card({id:'abc123'});
		cb.dealToPlayer();
		assert.equal(d.addCard(ca,'A'),false,'card A has been added');
		assert.equal(d.addCard(cb,'B'),false,'card B has been added');
		assert.equal(d.currentState,'waitingForCards','state check');
	});
	it('should move in once cards are locked in', function () {
		let d = new Duel();
		let ca = new Card({id:'abc123'});
		ca.dealToPlayer();
		let cb = new Card({id:'abc123'});
		cb.dealToPlayer();
		ca.selectCard();
		cb.selectCard();
		ca.confirm();
		cb.confirm();
		assert.equal(d.addCard(ca,'A'),false,'card A has been added');
		assert.equal(d.addCard(cb,'B'),true,'card B has been added');
		assert.equal(d.currentState,'waitingForAttacks','state check');
	});
	it('should reject an invalid card', function () {
		let d = new Duel();
		assert.equal(d.addCard(undefined,'A'),false,'card A has been added');
	});
	it('should allow a card to be added', function () {
		let d = new Duel();
		let ca = new Card({id:'abc123'});
		ca.dealToPlayer();
		let cb = new Card({id:'abc123'});
		cb.dealToPlayer();
		assert.equal(d.addCard(ca,'A'),false,'card A has been added');
		assert.equal(d.addCard(cb,'B'),false,'card B has been added');
		assert.equal(d.currentState,'waitingForCards','state check');
	});
});