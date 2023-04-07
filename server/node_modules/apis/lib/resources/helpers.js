'use strict';
var res = require('./resource').res;
var handlers = require('../handlers');
var data = handlers.data;
var impl = handlers.impl;
var ret = handlers.ret;

var defaultImpl = function(ctrl, method) {
  return function(ctx) {
    ctrl[method](ctx.auth, ctx.data, ctx.cb);
  };
};

var methods = [ 'get', 'create', 'update', 'del', 'call' ];

var add = function(contract, authOpts, resOpts) {
  var auth = authOpts.handler;
  var authFunc = authOpts.authFunc;
  var api = resOpts.api;
  var request = resOpts.request;
  var response = resOpts.response || {};
  var resourceMethods = {};
  var base = resOpts.base || '';

  for (var i in methods) {
    var method = methods[i];
    if (request[method] === undefined) {
      continue;
    }

    var m = resourceMethods[method] = [];

    //defaults: get - opt, else - required
    var methodAuth = request.auth ? request.auth[method] : 'default';

    switch (methodAuth) {
      case 'none':
        break;

      case 'required':
        m.push(auth(authFunc));
        break;

      case 'optional':
        m.push(auth(authFunc).opt);
        break;

      default:
        if (method === 'get') {
          m.push(auth(authFunc).opt);
        } else {
          m.push(auth(authFunc));
        }
    }

    if (request[method] !== 'none') {
      m.push(data( request[method]() ));
    }

    if (response[method]) {
      m.push(ret( response[method]() ));
    } else {
      m.push(ret.any);
    }

    if (api.implements) {
      m.push(impl( api.implements(method) ));
    } else {
      m.push(impl( defaultImpl(api, method) ));
    }
  }

  contract.add(res( base + '/' + api.resource, resourceMethods));
};


module.exports = {
  add: add
};
