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

    /* Key event notes
     * Types:                        Char Dec | Char Dec
     *   * 7: key_down              --------------------
     *   * 9: key_up                 A     65 | N     78
     *                               B     66 | O     79
     * Modifiers:                    C     67 | P     80
     *   * 1 << 0: Shift             D     68 | Q     81
     *   * 1 << 1: Ctrl              E     69 | R     82
     *   * 1 << 2: Alt               F     70 | S     83
     *   * 1 << 3: Command           G     71 | T     84
     *   * 1 << 4: Numpad Keys       H     72 | U     85
     *   * 1 << 8: CapsLock          I     73 | V     86
     *   * 1 << 9: Numlock           J     74 | W     87
     *   * 1 << 10: Windows          K     75 | X     88
     *                               L     76 | Y     89
     *                               M     77 | Z     90
     */

    handler = function(evt) {
        common.log.out(JSON.stringify(evt));

        var modifier = (1 << 1); /* ctrl */
        var modifier_key = 17;
        if(process.platform === 'darwin') {
            modifier = (1 << 3); /* command */
            modifier_key = 91;
        }
        /* Modifier masks */
        var shift   = (1 << 0);
        var ctrl    = (1 << 1);
        var alt     = (1 << 2);
        var command = (1 << 3);
        /* Modifier keycodes */
        var shift_key   = 16;
        var ctrl_key    = 17;
        var alt_key     = 18;
        var command_key = 91;

        /* Is pressed */
        var mod_pressed = evt.modifiers & 15;
        var shift_pressed = (mod_pressed & shift) == shift;
        var ctrl_pressed = (mod_pressed & ctrl) == ctrl;
        var alt_pressed = (mod_pressed & alt) == alt;
        var command_pressed = (mod_pressed & command) == command;
        /* Is only pressed */
        var only_shift_pressed = mod_pressed == shift;
        var only_ctrl_pressed = mod_pressed == ctrl;
        var only_alt_pressed = mod_pressed == alt;
        var only_command_pressed = mod_pressed == command;

        /* Handle shortcutes */

        /* Focus VimLine: [:] */
        if(evt.type === 9 && evt.keycode === 186 && only_shift_pressed) {
            common.log.out('Emit `focus_vimline`');
            that.emit('focus_vimline');
        }

        /* Reload: [r] */
        if(evt.type === 9 && evt.keycode === 82 && !mod_pressed) {
            common.log.out('Emit `reload`');
            that.emit('reload');
        }

        /* Move Left: [h] */
        if(evt.type === 9 && evt.keycode === 72 && !mod_pressed) {
            common.log.out('Emit `move_left`');
            that.emit('move_left');
        }

        /* Move Down: [j] */
        if(evt.type === 9 && evt.keycode === 74 && !mod_pressed) {
            common.log.out('Emit `move_down`');
            that.emit('move_down');
        }

        /* Move Up: [k] */
        if(evt.type === 9 && evt.keycode === 75 && !mod_pressed) {
            common.log.out('Emit `move_up`');
            that.emit('move_up');
        }

        /* Move Right: [l] */
        if(evt.type === 9 && evt.keycode === 76 && !mod_pressed) {
            common.log.out('Emit `move_right`');
            that.emit('move_right');
        }

        /* Page Up: [C-u] */
        if(evt.type === 9 && evt.keycode === 85 && only_ctrl_pressed) {
            common.log.out('Emit `page_up`');
            that.emit('page_up');
        }

        /* Page Down: [C-d] */
        if(evt.type === 9 && evt.keycode === 68 && only_ctrl_pressed) {
            common.log.out('Emit `page_down`');
            that.emit('page_down');
        }

        my.last = evt;
    };

    init = function(cb_) {
        breach.module('core').on('tabs:keyboard', handler);
        return cb_();
    };

    kill = function(cb_) {
        return cb_();
    };

    common.method(that, 'init', init, _super);
    common.method(that, 'kill', kill, _super);

    return that;
};

exports.key_handler = key_handler;
