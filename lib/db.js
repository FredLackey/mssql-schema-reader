/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var queries = require('./queries'),
    sql	    = require('mssql'),
    fs		= require('fs'),
    path    = require('path');

var STRINGIFY_OPTIONS   = null,
    STRINGIFY_SPACES    = 4;

sql.on('error', function(err) {
    console.log(err);
});

var fetch = function (config, callback) {
    var response = {
        database:   config.database,
        server:     config.server,
        user:       config.user,
        created:    new Date(),
        items:      []
    };
    var conn = new sql.Connection(config, function (err) {
        if (err) {
            return callback(err);
        }
        queries.list.forEach(function (query) {
            var request = new sql.Request(conn);
            request.query(query.text, function (err, rs) {
                if (err) {
                    return callback(err);
                }
                var result = {
                    name: query.name,
                    count: rs.length,
                    items: []
                };
                rs.forEach(function (row) {
                    result.items.push(row);
                });
                response.items.push(result);
                if (response.items.length == queries.list.length) {
                    conn.close();
                    return callback(null, response);
                }
            })
        });
    });
};

var retainFile = function (filepath, callback) {
    if (!fs.existsSync(filepath)) { return callback(); }
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) { return callback(err); }
        var doc = JSON.parse(data);
        if (!doc.database) { return callback(new Error('Invalid existing schema (no database)')); }
        if (!doc.created) { return callback(new Error('Invalid existing schema (no created date)')); }
        var date    = new Date(doc.created),
            newName = doc.database + '-' + date.toString('YYYYMMDDHHmmss') + '.schema',
            newPath = path.join(path.dirname(filepath), newName);
        if (fs.existsSync(newPath)) { return callback(); }
        fs.writeFile(newPath, data, function (err, fsData) {
            if (err) { return callback(err); }
            return callback();
        });
    });
}
var retainFileOptional = function (filepath, saveLastVersion, callback) {
    if (!!saveLastVersion) {
        retainFile(filepath, function (err, rfData) {
            if (err) { return callback(err); }
            return callback();
        });
    } else {
        return callback();
    }
}

var fetchWithSave = function (config, filePath, saveLastVersion, callback) {
    retainFileOptional(filePath, saveLastVersion, function (err) {
        if (err) { return callback (err); }
        fetch(config, function (err, schemaInfo) {
            if (err) { return callback(err); }
            fs.writeFile(filePath, JSON.stringify(schemaInfo, STRINGIFY_OPTIONS, STRINGIFY_SPACES), function (err, fsData) {
                if (err) { return callback(err); }
                return callback(null, schemaInfo);
            });
        });
    })
};

var read = function (filePath, callback) {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) { return callback(err); }
        callback(null, JSON.parse(data));
    });
};

module.exports = {
    fetch:          fetch,
    fetchWithSave:  fetchWithSave,
    read:           read
};