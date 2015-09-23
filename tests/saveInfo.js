/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var lib     = require('../lib'),
    fs		= require('fs');

var username    = 'sa',
    password    = 'Pass1234',
    server      = 'localhost',
    database    = 'TestDatabase20150922',
    encrypt     = false,
    infoFile    = 'C:\\Temp\\schema-info.json',
    schemaFile  = 'C:\\Temp\\schema-pretty.json';

var config = lib.helpers.createConfig(username, password, server, database, encrypt);

console.log(config);

lib.db.fetchWithSave(config, infoFile, function (err, info) {
    if (err) { return console.log(err); }
    if (!info) { return console.log('Info not returned'); }
    console.log('---------------- FETCH WITH SAVE -----------------');
    console.log('Info date: ' + info.created);
});

lib.db.read(infoFile, function (err, info) {
    if (err) { return console.log(err); }
    if (!info) { return console.log('Info not returned'); }
    var parser = lib.parser(info);
    var schema = parser.getSchema();
    console.log('--------------- READ & CREATE SCHEMA -------------');
    console.log('Schema: ' + JSON.stringify(schema));
});

lib.db.read(infoFile, function (err, info) {
    if (err) { return console.log(err); }
    if (!info) { return console.log('Info not returned'); }
    var parser = lib.parser(info);
    var schema = parser.getSchema();
    console.log('-------------- READ INFO / SAVE SCHEMA -----------');
    fs.writeFile(schemaFile, JSON.stringify(schema, null, 4), function (err, fsData) {
        if (err) { return console.log('Error saving schema file: ' + err.message); }
        console.log('Schema file saved: ' + schemaFile);
    });
});