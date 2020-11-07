import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

import { LuaStateMapping } from '../../luastatemapping';
import { Mapping } from '../../mapping';
import * as path from 'path';

const defaultTestMapping : Mapping[] = [
	{ 
		folder: "parent_1/child_1",
		state: "State_1_1"
	},
	{ 
		folder: "parent_1/child_2",
		state: "State_1_2"
	},
	{ 
		folder: "parent_2/child_1",
		state: "State_2_1"
	}
];

suite('Lua State Mapping', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Empty workspace root path and empty state mapping', () => {
		const lsm = new LuaStateMapping("", []);
		assert.strictEqual(lsm.findLuaState(''), '');
		// Posix path style
		assert.strictEqual(lsm.findLuaState('/'), '');
		assert.strictEqual(lsm.findLuaState('/parent'), '');
		assert.strictEqual(lsm.findLuaState('/parent/child'), '');
		// windows path style
		assert.strictEqual(lsm.findLuaState('\\'), '');
		assert.strictEqual(lsm.findLuaState('\\parent'), '');
		assert.strictEqual(lsm.findLuaState('\\parent\\child'), '');
	});

	test('Empty workspace root', () => {
		const lsm = new LuaStateMapping("", defaultTestMapping);
		assert.strictEqual(lsm.findLuaState(path.join('parent_1', 'child_1', 'file.lua')), 'State_1_1');
		assert.strictEqual(lsm.findLuaState(path.join('parent_1', 'child_2', 'file.lua')), 'State_1_2');
		assert.strictEqual(lsm.findLuaState(path.join('parent_2', 'child_1', 'file.lua')), 'State_2_1');
	});

	test('Empty lua file path', () => {
		const wsPath = path.join("home", "transferlua", "wspath");
		const lsm = new LuaStateMapping(wsPath, defaultTestMapping);
		assert.strictEqual(lsm.findLuaState(''), '');
	});

	test('Some workspace path', () => {
		const wsPath = path.join("home", "transferlua", "wspath");
		const lsm = new LuaStateMapping(wsPath, defaultTestMapping);
		assert.strictEqual(lsm.findLuaState(path.join(wsPath, 'parent_1', 'child_1', 'file.lua')), 'State_1_1');
		assert.strictEqual(lsm.findLuaState(path.join(wsPath, 'parent_1', 'child_2', 'file.lua')), 'State_1_2');
		assert.strictEqual(lsm.findLuaState(path.join(wsPath, 'parent_2', 'child_1', 'file.lua')), 'State_2_1');
	});
	
	test('Lua file path which is not covered by mapping', () => {
		const wsPath = path.join("home", "transferlua", "wspath");
		const lsm = new LuaStateMapping(wsPath, defaultTestMapping);
		assert.strictEqual(lsm.findLuaState(path.join(wsPath, 'uncovered_1')), '');
		assert.strictEqual(lsm.findLuaState(path.join(wsPath, 'uncovered_1', 'child_2')), '');
		assert.strictEqual(lsm.findLuaState(path.join(wsPath, 'uncovered_1', 'child_1', 'file.lua')), '');
	});

});
