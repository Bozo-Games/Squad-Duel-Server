"use strict";
const assert = require('assert');
const Attack = require('../server/Models/Attack.js');
const logger = require('../server/Helpers/logger.js');
describe('Attack Model', function () {
	before(function() {
		logger.on = false;
	});
	it('should exist', function() {
		assert.ok(Attack !== undefined)
	});
	it('should respond to toJSON()', function () {
		let a = new Attack();
		assert.ok(typeof a.toJSON === 'function');
	});
	it('should have default values', function () {
		let a = new Attack();
		assert.equal(a.id, -1);
		assert.equal(a.category, 'unknown');
		assert.equal(a.name, 'unknown');
		assert.equal(a.power, 0);
		assert.equal(a.speed, 0);
	});
	it('should accept a id in constructor', function () {
		let a = new Attack({id:'abc123'});
		assert.ok(a.id === 'abc123');
	});
	it('should accept a name in constructor', function () {
		let a = new Attack({name:'noName'});
		assert.ok(a.name === 'noName');
	});
	it('should accept a power in constructor', function () {
		let a = new Attack({power:3});
		assert.ok(a.power === 3);
	});
	it('should accept a speed in constructor', function () {
		let a = new Attack({speed:4});
		assert.ok(a.speed === 4);
	});
	it('should accept a category in constructor', function () {
		let a = new Attack({category:'test category'});
		assert.ok(a.category === 'test category');
	});
	it('should return a JSON object with id, name, category, ppower and speed matching it\'s constructor', function () {
		let a = new Attack({id:'abc123', name:'noName',category:'test category',power:3,speed:4});
		let json = a.toJSON();
		assert.ok(json.id === 'abc123');
		assert.ok(json.name === 'noName');
		assert.ok(json.category === 'test category');
		assert.ok(json.power === 3);
		assert.ok(json.speed === 4);
	});
});