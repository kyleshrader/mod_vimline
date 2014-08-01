/* Breach: [mod_vimline] index.js
 * @author: kylekinkade
 */
'use strict';

var express = require('express');
var http = require('http')
var common = require('./lib/common.js');
var breach = require('breach_module');
var async = require('async');

var bootstrap = function(http_srv) {
    var http_port = http_srv.address().port;

    common._ = {
        tabs: require('./lib/tabs.js').tabs({}),
        vimline: require('./lib/vimline.js').vimline({http_port:http_port})
    };

    breach.init(function() {
        breach.register('core', 'tabs:.*');

        breach.expose('init', function(src, args, cb_) {
            async.parallel([
                common._.tabs.init,
                common._.vimline.init
            ], cb_);
        });

        breach.expose('kill', function(args, cb_) {
            async.parallel([
                common._.tabs.kill,
                common._.vimline.kill
            ], function(err) {
                common.exit(0);
            });
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
