'use strict';
var inherits = require('util').inherits;
var AppBase = require('./app_base');

var DaemonMaster = function(opts) {
  AppBase.call(this, opts);
};
inherits(DaemonMaster, AppBase);

DaemonMaster.prototype.addUnits = function() {
};

DaemonMaster.prototype.start = function() {
  this.ensureInited();
  this.units.require('core.daemon').start();
  console.log('Deamon startup time:', Date.now() - this.startTime + 'ms');
};

DaemonMaster.prototype.stop = function() {
  this.ensureInited();
  this.units.require('core.daemon').stop();
};

DaemonMaster.prototype.restart = function() {
  this.ensureInited();
  this.units.require('core.daemon').restart();
};


module.exports = DaemonMaster;
