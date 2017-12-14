"use strict";
const assert = require('assert');
const Player = require('../server/Models/Player.js');
const logger = require('../server/Helpers/logger.js');
describe('Player Model', function () {
	before(function() {
		logger.on = false;
	});
	it('should exist', function() {
		assert.ok(Player !== undefined)
	});
	it('should respond to toJSON()', function () {
		let p = new Player();
		assert.ok(typeof p.toJSON === 'function');
	});
	it('should have default values', function () {
		let p = new Player();
		assert.equal(p.name, undefined);
		assert.equal(p.socketID, undefined);
	});
	it('should accept a socketID in constructor', function () {
		let p = new Player({socketID:'abc123'});
		assert.ok(p.socketID === 'abc123');
	});
	it('should accept a name in constructor', function () {
		let p = new Player({name:'noName'});
		assert.ok(p.name === 'noName');
	});
	it('should return a JSON object with name and socketID matching it\'s constructor', function () {
		let p = new Player({socketID:'abc123', name:'noName'});
		let json = p.toJSON();
		assert.equal(json.name, 'noName','json.name is incorrect');
		assert.equal(json.socketID,'abc123','json.socketID is incorrect');
	});
});