var fs = require('fs');
var path = require('path');
var assert = require('assert');
var from = require('from');
var readdir = require('readdir-stream');
var through2 = require('through2');
var FSRepo = (function () {
    function FSRepo(dir) {
        assert((typeof dir === 'string' && dir), 'dir must be a string: ' + dir);
        this.dir = dir;
    }
    FSRepo.prototype.getTree = function () {
        var that = this;
        return readdir(this.dir).pipe(through2.obj(function (entry, enc, callback) {
            if (entry.stat.isFile()) {
                this.push({
                    path: path.relative(that.dir, entry.path).replace(/\\/g, '/'),
                    size: entry.stat.size
                });
            }
            callback();
        }));
    };
    FSRepo.prototype.getBlob = function (file) {
        return fs.createReadStream(path.join(this.dir, file));
    };
    FSRepo.prototype.getHistory = function (file) {
        fs.exists(file, function (exists) {
            if (!exists) {
            }
        });
        return from([]);
    };
    return FSRepo;
})();
module.exports = FSRepo;
