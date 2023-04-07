'use strict';
let inherits = require('util').inherits;
let AuthProvider = require('authen/lib/auth_provider');

let ServiceAuthProvider = function(options) {
  AuthProvider.call(this, options);
};
inherits(ServiceAuthProvider, AuthProvider);

ServiceAuthProvider.prototype.prepareAuthResult = function(ctx, options, authResult, cb) {
  let result = {
    type: this.type,
    identity: this.getIdentity(authResult),
    authResult: result
  };
  if (options.allowOnBehalf && this.options.allowOnBehalf) {
    let onBehalf = this.createOnBehalfResult(ctx);
    if (onBehalf != null) {
      let via = result;
      result = onBehalf;
      result.via = via;
    }
  }
  cb(null, result);
};

ServiceAuthProvider.prototype.unpackOnBehalfIdentity = function(identityStr) {
  return identityStr;
};

ServiceAuthProvider.prototype.createOnBehalfResult = function(ctx) {
  let result = null;
  let onBehalfData = this.adapter.extractOnBehalfData(ctx);
  if (onBehalfData != null) {
    result = {
      type: onBehalfData.type || this.options.defaultOnBehalfAuthType,
      identity: this.unpackOnBehalfIdentity(onBehalfData.identityStr),
      onBehalfData: onBehalfData
    };
  }
  return result;
};


module.exports = ServiceAuthProvider;
