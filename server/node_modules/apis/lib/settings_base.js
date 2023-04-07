'use strict';
let path = require('path');

let SettingsBase = function() {
};

SettingsBase.prototype.unitIsInitRequired = true;

SettingsBase.prototype.unitInit = function(units) {
  this.prepare();
};

SettingsBase.prototype.prepare = function() {
  this.init();

  let env = process.env.APIS_ENV;
  env && this.applyEnvironment(env);
};

SettingsBase.prototype.applyEnvironment = function(env) {
  let envSettings;

  try {
    envSettings = require( path.join( process.cwd(), 'lib', 'settings', env) );
    envSettings(this);
  } catch (e) {
    console.log(`No '${env}' environment settings file found`);
    process.exit();
  }
};


module.exports = SettingsBase;
