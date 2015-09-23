/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var lib = require('./lib');

var fromServerRaw = function (config, callback) {
    lib.db.fetch(config, function (err, info) {
        if (err) { return callback(err); }
        return callback(null, info);
    })
};
var fromServerToDiskRaw = function (config, filePath, saveLastVersion, callback) {
    lib.db.fetchWithSave(config, filePath, saveLastVersion, function (err, info) {
        if (err) { return callback(err); }
        return callback(null, info);
    })
};

var fromDiskRaw = function (filePath, callback) {
    lib.db.read(filePath, function (err, info) {
        if (err) { return callback(err); }
        return callback(null, info);
    })
};

var fromServer = function (config, callback) {
    lib.db.fetch(config, function (err, info) {
        if (err) { return callback(err); }
        var parser = lib.parser(info);
        return callback(null, parser.getSchema());
    })
};
var fromServerToDisk = function (config, filePath, saveLastVersion, callback) {
    lib.db.fetchWithSave(config, filePath, saveLastVersion, function (err, info) {
        if (err) { return callback(err); }
        var parser = lib.parser(info);
        return callback(null, parser.getSchema());
    })
};

var fromDisk = function (filePath, callback) {
    lib.db.read(filePath, function (err, info) {
        if (err) { return callback(err); }
        var parser = lib.parser(info);
        return callback(null, parser.getSchema());
    })
};

module.exports = {
    createConfig:           lib.helpers.createConfig,       // For convenience
    schema: {
        fromServer:         fromServer,
        fromServerToDisk:   fromServerToDisk,
        fromDisk:           fromDisk
    },
    info: {
        fromServer:         fromServerRaw,
        fromServerToDisk:   fromServerToDiskRaw,
        fromDisk:           fromDiskRaw
    }
};