var common = require('./common.js');
var events = require('events');
var breach = require('breach_module');

var key_handler = function() {
    var _super = {};
    var my = {};
    var is_last;
    var handler;

    var init;
    var kill;

    var that = new events.EventEmitter();

    my.last = null;
    my.can_commit = false;

    is_last = function(event) {
        if( my.last &&
            my.last.type === event.type &&
            my.last.keycode === event.keycode &&
            my.last.modifiers === event.modifiers)
            return true;
        return false;
    };

    handler = function(evt) {
        common.log.out(JSON.stringify(evt));

        var modifier = (1 << 1); /* ctrl */
        var modifier_key = 17;
        if(process.platform === 'darwin') {
            modifier = (1 << 3); /* command */
            modifier_key = 91;
        }
        /* use for ctrl on darwin */
        var ctrl = (1 << 1);
        var ctrl_key = 17;
        var shift = 1;
        var shift_key = 16;

        /* Handle shortcutes */

        my.last = evt;
    };

    init = function(cb_) {
        breach.module('core').on('controls:keyboard', handler);
        breach.module('core').on('tabs:keyboard', handler);
        return cb_();
    };

    kill = function(cb_) {
        return cb_();
    };

    common.method(that, 'init', init, _super);
    common.method(that, 'kill', init, _super);

    return that;
};

exports.key_handler = key_handler;
