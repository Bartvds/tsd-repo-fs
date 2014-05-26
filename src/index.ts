/// <reference path="../typings/tsd.d.ts" />

import fs = require('fs');
import path = require('path');
import assert = require('assert');

import from = require('from');
import readdir = require('readdir-stream');

import through2 = require('through2');

class FSRepo {

	dir: string;

	constructor(dir: string) {
		assert((typeof dir === 'string' && dir), 'dir must be a string: ' + dir);
		this.dir = dir;
	}

	getTree(): NodeJS.ReadableStream {
		var that = this;
		return readdir(this.dir).pipe(through2.obj(function (entry: any, enc: string, callback: () => void) {
			if (entry.stat.isFile()) {
				this.push({
					path: path.relative(that.dir, entry.path).replace(/\\/g, '/'),
					size: entry.stat.size
				});
			}
			callback();
		}));
	}

	getBlob(file: string): NodeJS.ReadableStream {
		return fs.createReadStream(path.join(this.dir, file));
	}

	getHistory(file: string): NodeJS.ReadableStream {
		fs.exists(file, (exists) => {
			if (!exists) {

			}
		});
		return from([]);
	}
}

export = FSRepo;
