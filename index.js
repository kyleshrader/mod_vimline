/*
 * Breach: [mod_vimline] index.js
 *
 * Copyright (c) 2014, Kyle Kinkae. All rights reserved.
 *
 * @author: kylekinkade
 *
 * @log:
 * - 2014-07-22 kylekinkade   Creation
 */
'use strict';

var breach = require('breach_module');
var common = require('./lib/common.js');

breach.init(function() {
  breach.expose('init', function(src, args, cb_) {
    console.log('Initialization');
    return cb_();
  });

  breach.expose('kill', function(args, cb_) {
    common.exit(0);
  });
});

process.on('uncaughtException', function (err) {
  common.fatal(err);
});
