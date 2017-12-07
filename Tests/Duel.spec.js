"use strict";
const assert = require('assert');
const seedrandom = require('seedrandom');
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
	it('should calculate imitative correctly A>B', function () {
		//A>B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2, attacks: [{id: 'gef678', speed: 2}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2, attacks: [{id: 'obj901', speed: 1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [{letter: "A", powerMultiplier: 1}, {
			letter: "B",
			powerMultiplier: 1
		}], 'turn order is correct');
	});
	it('should calculate imitative correctly A>2B', function () {
		//A>2B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 4, attacks: [{id: 'gef678', speed: 3}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2, attacks: [{id: 'obj901', speed: 1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [{letter: "A", powerMultiplier: 1}, {
			letter: "A",
			powerMultiplier: 1
		}, {letter: "B", powerMultiplier: 1}], 'turn order is correct');
	});
	it('should calculate imitative correctly A > 1.5B', function () {
		//A>1.5B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2, attacks: [{id: 'gef678', speed: 3}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2, attacks: [{id: 'obj901', speed: 1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [{letter: "A", powerMultiplier: 1}, {
			letter: "B",
			powerMultiplier: 1
		}, {letter: "A", powerMultiplier: 0.5}], 'turn order is correct');
	});
	it('should calculate imitative correctly ties A wins tie', function () {
		seedrandom('abc', {global: true});
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 1, attacks: [{id: 'gef678', speed: 1}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 1, attacks: [{id: 'obj901', speed: 1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
			{letter: "A", powerMultiplier: 1},
			{letter: "B",powerMultiplier: 1}],
			'turn order is correct');
	});
	it('should calculate imitative correctly B wins tie', function () {
		seedrandom('def', {global: true});
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 1, attacks: [{id: 'gef678', speed: 1}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 1, attacks: [{id: 'obj901', speed: 1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns,[
				{letter: "B", powerMultiplier: 1},
				{letter: "A",powerMultiplier: 1}],
			'turn order is correct');
	});
	it('should calculate imitative correctly B>A', function () {
		//B>A
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2, attacks: [{id: 'gef678', speed: 1}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2, attacks: [{id: 'obj901', speed: 2}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
			{letter: "B", powerMultiplier: 1},
			{letter: "A", powerMultiplier: 1}],
			'turn order is correct');
	});

	it('should calculate imitative correctly B>2A', function () {
		//B>2A
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2, attacks: [{id: 'gef678', speed: 1}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 4, attacks: [{id: 'obj901', speed: 3}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
			{letter: "B", powerMultiplier: 1},
			{letter: "B",powerMultiplier: 1},
			{letter: "A", powerMultiplier: 1}],
			'turn order is correct');
	});
	it('should calculate imitative correctly B>1.5A', function () {
		//B>1.5A
		let d = new Duel();
		let ca = new Card({id:'abc123',speed:1,attacks:[{id:'gef678',speed:2}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id:'edf456',speed:2,attacks:[{id:'obj901',speed:3}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca,'A'),false,'card A has been added');
		assert.equal(d.addCard(cb,'B'),true,'card B has been added');
		assert.equal(d.currentState,'waitingForAttacks','state check');
		assert.equal(d.addAttack(ca.attacks[0].id,'A'),false,'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id,'B'),true,'attack B has been added');
		assert.equal(d.currentState,'ready','state check');
		assert.equal(d._stateMachine.handleInitiative(),true,'initiative should be able to happen');
		assert.equal(d.currentState,'initiativeDone','state check');
		assert.deepEqual(d._stateMachine.turns,[
			{letter:"B",powerMultiplier:1},
			{letter:"A",powerMultiplier:1},
			{letter:"B",powerMultiplier:0.5}],
			'turn order is correct');
	});
	it('should move from imitative to next',function () {
		//A>B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2,health:10,armor:2, attacks: [{id: 'gef678', speed: 2,crushing:2}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2,health:10,armor:1, attacks: [{id: 'obj901', speed: 1,crushing:1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
				{letter: "A", powerMultiplier: 1},
				{letter: "B",powerMultiplier: 1}],
			'turn order is correct');
		assert.equal(d._stateMachine.nextAttack(), true, 'move to new attack');
		assert.equal(d._stateMachine.state,'newAttack');
		assert.equal(d._stateMachine.attacker,'A');
		assert.equal(d._stateMachine.attackPoerMultiplier,1);
		assert.equal(d._stateMachine.defender,'B');
	});
	it('should move from newAttack to crushingDone with no dmg done if attack category is not crush',function () {
		//A>B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2,health:10,armor:2, attacks: [{category:'none',id: 'gef678', speed: 2,crushing:2}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2,health:10,armor:1, attacks: [{id: 'obj901', speed: 1,crushing:1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
				{letter: "A", powerMultiplier: 1},
				{letter: "B",powerMultiplier: 1}],
			'turn order is correct');
		assert.equal(d._stateMachine.nextAttack(), true, 'move to new attack');
		assert.equal(d._stateMachine.state,'newAttack');
		assert.equal(d._stateMachine.attacker,'A');
		assert.equal(d._stateMachine.attackPoerMultiplier,1);
		assert.equal(d._stateMachine.defender,'B');
		assert.equal(d._stateMachine.handleCrushing(), true, 'move to crushing Done');
		assert.equal(d.currentState, 'crushingDone', 'state check');
		assert.equal(d.cardB.armor,1);
		assert.equal(d.cardB.health,10);
	});
	it('should move from newAttack to crushingDone with dmg done if attack category is crush and damage armor',function () {
		//A>B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2,health:10,armor:2, attacks: [{category:'crush',id: 'gef678', speed: 2,power:2}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2,health:10,armor:3, attacks: [{id: 'obj901', speed: 1,power:1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
				{letter: "A", powerMultiplier: 1},
				{letter: "B",powerMultiplier: 1}],
			'turn order is correct');
		assert.equal(d._stateMachine.nextAttack(), true, 'move to new attack');
		assert.equal(d._stateMachine.state,'newAttack');
		assert.equal(d._stateMachine.attacker,'A');
		assert.equal(d._stateMachine.attackPoerMultiplier,1);
		assert.equal(d._stateMachine.defender,'B');
		assert.equal(d._stateMachine.handleCrushing(), true, 'move to crushing Done');
		assert.equal(d.currentState, 'crushingDone', 'state check');
		assert.equal(d.cardB.armor,1);
		assert.equal(d.cardB.health,10);
	});
	it('should move from newAttack to crushingDone with dmg done if attack category is crush and roll over to dmg health',function () {
		//A>B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2,health:10,armor:2, attacks: [{category:'crush',id: 'gef678', speed: 2,power:4}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2,health:10,armor:3, attacks: [{id: 'obj901', speed: 1,power:1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
				{letter: "A", powerMultiplier: 1},
				{letter: "B",powerMultiplier: 1}],
			'turn order is correct');
		assert.equal(d._stateMachine.nextAttack(), true, 'move to new attack');
		assert.equal(d._stateMachine.state,'newAttack');
		assert.equal(d._stateMachine.attacker,'A');
		assert.equal(d._stateMachine.attackPoerMultiplier,1);
		assert.equal(d._stateMachine.defender,'B');
		assert.equal(d._stateMachine.handleCrushing(), true, 'move to crushing Done');
		assert.equal(d.currentState, 'crushingDone', 'state check');
		assert.equal(d.cardB.armor,0);
		assert.equal(d.cardB.health,9);
	});

	it('should move from crushingDone to piercingDone with dmg done if attack category is pierce',function () {
		//A>B
		let d = new Duel();
		let ca = new Card({id: 'abc123', speed: 2,health:10,armor:2, attacks: [{category:'pierce',id: 'gef678', speed: 2,power:4}]});
		ca.dealToPlayer();
		ca.selectCard();
		ca.confirm();
		let cb = new Card({id: 'edf456', speed: 2,health:10,armor:3, attacks: [{id: 'obj901', speed: 1,power:1}]});
		cb.dealToPlayer();
		cb.selectCard();
		cb.confirm();
		assert.equal(d.addCard(ca, 'A'), false, 'card A has been added');
		assert.equal(d.addCard(cb, 'B'), true, 'card B has been added');
		assert.equal(d.currentState, 'waitingForAttacks', 'state check');
		assert.equal(d.addAttack(ca.attacks[0].id, 'A'), false, 'attack A has been added');
		assert.equal(d.addAttack(cb.attacks[0].id, 'B'), true, 'attack B has been added');
		assert.equal(d.currentState, 'ready', 'state check');
		assert.equal(d._stateMachine.handleInitiative(), true, 'initiative should be able to happen');
		assert.equal(d.currentState, 'initiativeDone', 'state check');
		assert.deepEqual(d._stateMachine.turns, [
				{letter: "A", powerMultiplier: 1},
				{letter: "B",powerMultiplier: 1}],
			'turn order is correct');
		assert.equal(d._stateMachine.nextAttack(), true, 'move to new attack');
		assert.equal(d._stateMachine.state,'newAttack');
		assert.equal(d._stateMachine.attacker,'A');
		assert.equal(d._stateMachine.attackPoerMultiplier,1);
		assert.equal(d._stateMachine.defender,'B');
		assert.equal(d._stateMachine.handleCrushing(), true, 'move to crushing Done');
		assert.equal(d.currentState, 'crushingDone', 'state check');
		assert.equal(d._stateMachine.handlePiercing(), true, 'move to crushing Done');
		assert.equal(d.currentState, 'piercingDone', 'state check');
		assert.equal(d.cardB.armor,3);
		assert.equal(d.cardB.health,6);
	});

});