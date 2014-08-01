"use strict"

var common = require('./common.js');
var breach = require('breach_module');
var async = require('async');

var vimline = function(spec, my) {
    var _super = {};
    my = my || {};
    spec = spec || {};
    my.key_handler = null;
    my.http_port = spec.http_port;

    var init;
    var kill;

    var shortcut_focus_vimline;
    var shortcut_reload;
    var shortcut_move_left;
    var shortcut_move_down;
    var shortcut_move_up;
    var shortcut_move_right;
    var shortcut_page_up;
    var shortcut_page_down;

    var that = {};

    shortcut_focus_vimline = function() {
        common.log.out('shortcut_focus_vimline');
    };

    shortcut_reload = function() {
        common.log.out('shortcut_reload');
        common._.tabs.action_reload();
    };

    init = function(cb_) {
        async.series([
            function(cb_) {
                my.key_handler = require('./key_handler.js').key_handler();
                my.key_handler.on('reload', shortcut_reload);

                return cb_();
            },
            function(cb_) {
                async.parallel([
                    my.key_handler.init,
                ], cb_);
            },
            function(cb_) {
                breach.module('core').call('controls_set', {
                    type: 'BOTTOM',
                    url: 'http://127.0.0.1:' + my.http_port + '/vimline',
                    dimension: 22
                }, cb_);
            },
        ], cb_);
    };

    kill = function(cb_) {
        breach.module('core').call('controls_unset', {
            type: 'BOTTOM',
        }, cb_);
    };

    common.method(that, 'init', init, _super);
    common.method(that, 'kill', kill, _super);

    return that;
};

exports.vimline = vimline;
