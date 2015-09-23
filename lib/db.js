/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var queries = require('./queries'),
    sql	    = require('mssql'),
    fs		= require('fs');

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

var fetchWithSave = function (config, filePath, callback) {
    fetch(config, function (err, schemaInfo) {
        if (err) { return callback(err); }
        fs.writeFile(filePath, JSON.stringify(schemaInfo, STRINGIFY_OPTIONS, STRINGIFY_SPACES), function (err, fsData) {
            if (err) { return callback(err); }
            return callback(null, schemaInfo);
        });
    });
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