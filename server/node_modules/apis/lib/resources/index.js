"use strict";
var Resource = require("./resource");
var MethodMapper = require("./method_mapper");
var helpers = require("./helpers");


module.exports = {
	MethodMapper: MethodMapper,
	Resource: Resource,
	res: Resource.res,
	helpers: helpers
};
