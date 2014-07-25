/*
 * Breach: [mod_vimline] index.js
 *
 * Copyright (c) 2014, Kyle Kinkae. All rights reserved.
 *
 * @author: kylekinkade
 *
 * @log:
 * - 2014-07-24 kylekinkade   Adding http-serving controls
 * - 2014-07-22 kylekinkade   Creation
 */
'use strict';

var express = require('express');
var http = require('http')
var breach = require('breach_module');
var common = require('./lib/common.js');

var bootstrap = function(http_srv) {
    var http_port = http_srv.address().port;

    breach.init(function() {
        breach.expose('init', function(src, args, cb_) {
            breach.module('core').call('controls_set', {
                type: 'BOTTOM',
                url: 'http://127.0.0.1:' + http_port + '/vimline',
                dimension: 20
            }, cb_);
            return cb_();
        });

        breach.expose('kill', function(args, cb_) {
            breach.module('core').call('controls_unset', {
                type: 'BOTTOM'
            }, cb_);
            common.exit(0);
        });
    });
};

(function setup() {
    var app = express();

    var args = process.argv;
    args.forEach(function(a) {
        if(a === '--debug') {
            common.DEBUG = true;
        }
    });

    /* App Configuration */
    app.use('/', express.static(__dirname + '/controls'));
    app.use(require('body-parser')());
    app.use(require('method-override')());

    /* Listen locally only */
    var http_srv = http.createServer(app).listen(0, '127.0.0.1');

    http_srv.on('listening', function() {
        var port = http_srv.address().port;
        console.log('HTTP Server started on `http://127.0.0.1:' + port + '`');
        return bootstrap(http_srv);
    });
})();

process.on('uncaughtException', function (err) {
  common.fatal(err);
});
