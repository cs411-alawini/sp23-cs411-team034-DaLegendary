'use strict';
var path = require('path');
var cluster = require('cluster');
var rxEnv = /^--env=([-0-9a-zA-Z_]+)$/;

var Loader = function(opts) {
  // this.options = opts || {};
  this.setEnvironment(opts || {});
};

Loader.prototype.setEnvironment = function(opts) {
  let env = opts.env;
  let args = process.argv;

  for (var i = 2, l = args.length; i < l; i++) {
      var m = args[i].match(rxEnv);
      if (m) {
        env = m[1];
        args.splice(i, 1);
        break;
      }
  }

  if (env) {
    process.env.APIS_ENV = env;
  }
};

Loader.prototype.getSupportedCommands = function() {
  return [ 'run', 'start', 'stop', 'restart', 'worker', 'console' ];
};

Loader.prototype.run = function(cmd) {
  if (cmd === undefined) {
    cmd = process.argv[2];
  }

  switch (cmd) {
    case 'run':
      this.getApp().start();
      break;
    case 'start':
      this.getDaemonMaster().start();
      break;
    case 'stop':
      this.getDaemonMaster().stop();
      break;
    case 'restart':
      this.getDaemonMaster().restart();
      break;
    case 'daemon':
      this.getApp({ daemon: true }).start();
      break;
    case 'worker':
      this.getWorker().start();
      break;
    case 'console':
      this.getWorker().console();
      break;
    default:
      this.printUsageAndExit();
  }
};

Loader.prototype.printUsageAndExit = function() {
  console.log('Usage:');
  console.log('\t' + path.basename(process.argv[1]) + ' <command>');
  console.log();
  console.log('Supported commands:');
  console.log('\t' + this.getSupportedCommands().join(' '));
  process.exit(1);
};

Loader.prototype.basePath = 'lib';
Loader.prototype.standardBasePath = __dirname;

Loader.prototype.appFiles = {
  loader: 'loader',
  app: 'app',
  clusterMaster: 'cluster_master',
  daemonMaster: 'daemon_master',
  console: 'console'
};

Loader.prototype.standardUnitPaths = {
  'core.daemon': 'daemon',
  'core.cluster': 'cluster',

  'core.settings': 'settings',
  'core.handler': 'contract',

  'core.logging': 'logging/logging',
  'core.logging.engines.stream': 'logging/engines/stream',
  'core.logging.engines.syslog': 'logging/engines/syslog',

  'core.uncaught': 'uncaught',

  'core.mechanics.web': 'mechanics/web/mechanics',

  // sockets
  'core.mechanics.socket': 'mechanics/socket/mechanics',
  'core.mechanics.socket.stat': 'mechanics/socket/stat/stat'
};

Loader.prototype.unitPaths = {
  'core.settings': 'settings',
  'core.handler': 'contract'
};

Loader.prototype.getStandardUnitPath = function(name) {
  var result;
  var unitPath = this.standardUnitPaths[name];
  if (unitPath) {
    result = path.join(this.standardBasePath, unitPath);
  }
  return result;
};

Loader.prototype.getUnitPath = function(name) {
  var result;
  var unitPath = this.unitPaths[name];
  if (unitPath) {
    result = path.join(process.cwd(), this.basePath, unitPath);
  }
  return result;
};

Loader.prototype.resolveUnit = function(name) {
  var result = this.tryRequire(this.getUnitPath(name));
  if (!result) {
    var path = this.getStandardUnitPath(name);
    if (path) {
      result = require(path);
    }
  }
  return result;
};

Loader.prototype.loadUnit = function(name) {
  var result;
  var Unit = this.resolveUnit(name);
  if (Unit) {
    result = new Unit();
  }
  return result;
};

Loader.prototype.getPath = function(name) {
  return path.join(process.cwd(), this.basePath, this.appFiles[name]);
};

Loader.prototype.getStandardPath = function(name) {
  return path.join(this.standardBasePath, this.appFiles[name]);
};

Loader.prototype.tryRequire = function(id) {
  var result;
  if (id) {
    try {
      result = require(id);
    } catch (err) {
      var skipErr = false;
      if (err.code === 'MODULE_NOT_FOUND') {
        try {
          // NOTE ensure we cannot require this particular id,
          // not some of it's dependencies
          require.resolve(id);
        } catch (resolveErr) {
          if (resolveErr.code === 'MODULE_NOT_FOUND') {
            skipErr = true;
          }
        }
      }
      if (!skipErr) {
        throw err;
      }
    }
  }
  return result;
};

Loader.prototype.resolve = function(name, skipStandard) {
  var result = this.tryRequire(this.getPath(name));
  if (!result && !skipStandard) {
    var path = this.getStandardPath(name);
    if (path) {
      result = require(path);
    }
  }
  return result;
};

Loader.prototype.load = function(name, opts, defaults) {
  var result = defaults;
  var AppClass = this.resolve(name, !!defaults);
  if (AppClass) {
    var options = opts || {};
    options.loader = this;
    result = new AppClass(options);
  }
  return result;
};

Loader.prototype.require = function(name, opts, defaults) {
  var result = this.load(name, opts, defaults);
  if (!result) {
    throw new Error('Could not load ' + name);
  }
  return result;
};

Loader.prototype.getLoader = function(opts) {
  return this.require('loader', opts, this);
};

Loader.prototype.getApp = function(opts) {
  var result;
  if (cluster.isMaster) {
    result = this.getClusterMaster(opts);
  }
  if (!result) {
    result = this.getWorker(opts);
  }
  return result;
};

Loader.prototype.getWorker = function(opts) {
  return this.require('app', opts);
};

Loader.prototype.getClusterMaster = function(opts) {
  return this.require('clusterMaster', opts);
};

Loader.prototype.getDaemonMaster = function(opts) {
  return this.require('daemonMaster', opts);
};

Loader.create = function(opts) {
  return new Loader(opts).getLoader(opts);
};

Loader.run = function(opts) {
  return Loader.create(opts).run();
};


module.exports = Loader;
