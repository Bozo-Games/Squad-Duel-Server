"use strict";
const assert = require('assert');
const defaults = require('../client/duel/Helpers/defaults.js');
const logger = require('../server/Helpers/logger.js');
const Duel = require('../server/Models/Duel.js');
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
		assert(d.currentSate, 'waitingForCards');
	});
});