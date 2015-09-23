/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var createConfig = function (username, password, server, database, encrypt) {
    var config = {};
    if (username) { config.user = username; }
    if (password) { config.password = password; }
    if (server) { config.server = server; }
    if (database) { config.database = database; }
    if (typeof encrypt != 'undefined') { config.options = { encrypt: encrypt }; }
    return config;
};

module.exports = {
    createConfig:   createConfig
};