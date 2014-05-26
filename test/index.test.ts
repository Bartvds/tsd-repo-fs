
/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');

var assert = chai.assert;

import path = require('path');
import findup = require('findup-sync');
import streamTo = require('stream-to-array');

import FSRepo = require('../src/index');

var baseDir = path.join(path.dirname(findup('package.json')), 'test', 'fixtures', 'dir');

describe('basics', () => {
	it('sets up', () => {
		var repo = new FSRepo(baseDir);
		assert.strictEqual(repo.dir, baseDir, 'repo.dir');
	});

	it('streams tree', (done) => {
		var repo = new FSRepo(baseDir);
		var out = repo.getTree();

		streamTo(out, (err: any, arr: any[]) => {
			if (err) {
				done(err);
				return;
			}
			arr = arr.sort((a: any, b: any) => {
				return a.path > b.path ? 1 : 0;
			});

			var expected = [
				{ path: 'bar/bar.ts', size: 7 },
				{ path: 'bar/bazz.ts', size: 8 },
				{ path: 'foo/foo.ts', size: 12 },
				{ path: 'hoge.ts', size: 8 }
			];

			assert.deepEqual(arr, expected);

			done();
		});
	});

	it('streams blob', (done) => {
		var repo = new FSRepo(baseDir);
		var out = repo.getBlob('foo/foo.ts');

		streamTo(out, (err: any, arr: any[]) => {
			if (err) {
				done(err);
				return;
			}
			var actual = Buffer.concat(arr).toString();

			var expected = '// sup foo?\n';

			assert.strictEqual(actual, expected);

			done();
		});
	});

	it('streams empty history', (done) => {
		var repo = new FSRepo(baseDir);
		var out = repo.getHistory('foo/foo.ts');

		streamTo(out, (err: any, arr: any[]) => {

			var expected: any[] = [];

			assert.deepEqual(arr, expected);

			done(err);
		});
	});


	it('errors on non-string dir', () => {
		assert.throw(() => {
			var repo = new FSRepo(null);
		}, /^dir must be a string/);
	});

	it('errors on non-existing blob', (done) => {
		var repo = new FSRepo(baseDir);
		var out = repo.getBlob('foo/victor.ts');

		streamTo(out, (err: any, arr: any[]) => {
			assert.match(err.message, /^ENOENT/);
			done();
		});
	});

	it('errors on non-existing history', (done) => {
		var repo = new FSRepo(baseDir);
		var out = repo.getBlob('foo/victor.ts');

		streamTo(out, (err: any, arr: any[]) => {
			assert.match(err.message, /^ENOENT/);
			done();
		});
	});
});
