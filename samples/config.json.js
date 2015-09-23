/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

/*
 See the following page for more info on the Config object:
 https://www.npmjs.com/package/mssql#connection
 */

var config = {
    user:       '...',
    password:   '...',
    server:     'localhost',    // You can use 'localhost\\instance' to connect to named instance
    database:   '...',

    options: {
        encrypt: true           // Use this if you're on Windows Azure
    }
};

module.exports = config;