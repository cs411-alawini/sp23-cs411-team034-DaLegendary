"use strict";
var Ops = function () {
};

Ops.prototype.isDict = function (v) {
	return v != null && v.constructor === Object;
};

Ops.prototype.defines = function (v, k) {
	return v[k] !== undefined;
};

Ops.prototype.applyDefaults = function (options, defaults, opt_cloneDefaults) {
	var result;
	if (options == null) {
		if (opt_cloneDefaults) {
			defaults = this.clone(defaults);
		}
		result = defaults;
	}
	else {
		result = options;
		if (defaults != null) {
			for(var k in defaults) {
				var defaultsValue = defaults[k];
				if (this.defines(options, k)) {
					if (this.isDict(defaultsValue)) {
						var optionsValue = options[k];
						if (this.isDict(optionsValue)) {
							this.applyDefaults(optionsValue, defaultsValue);
						}
					}
				}
				else {
					if (opt_cloneDefaults) {
						defaultsValue = this.clone(defaultsValue);
					}
					options[k] = defaultsValue;
				}
			}
		}
	}
	return result;
};

Ops.prototype.clone = function (v) {
	return this.cloneValueWithDefaults(v);
};

Ops.prototype.cloneWithDefaults = function (options, defaults, opt_cloneDefaults) {
	var result;
	if (options == null) {
		if (opt_cloneDefaults) {
			result = this.clone(defaults);
		}
		else {
			result = defaults;
		}
	}
	else {
		result = this.cloneValueWithDefaults(options, defaults, opt_cloneDefaults);
	}
	return result;
};

Ops.prototype.cloneValueWithDefaults = function (v, defaults, opt_cloneDefaults) {
	if (v != null) {
		if (this.isDict(v)) {
			v = this.cloneDictWithDefaults(v, defaults, opt_cloneDefaults);
		} else if (Array.isArray(v)) {
			v = this.cloneArray(v);
		}
		// WARN assuming no user types can be here
	}
	return v;
};

Ops.prototype.cloneDict = function (v) {
	return this.cloneDictWithDefaults(v);
};

Ops.prototype.cloneDictWithDefaults = function (v, defaults, opt_cloneDefaults) {
	var result = {};
	var k;
	if (!this.isDict(defaults)) {
		defaults = null;
	}
	for (k in v) {
		var defaultsValue;
		if (defaults != null && k in defaults) {
			defaultsValue = defaults[k];
		}
		result[k] = this.cloneValueWithDefaults(v[k], defaultsValue, opt_cloneDefaults);
	}
	if (defaults != null) {
		for (k in defaults) {
			if (!this.defines(v, k)) {
				result[k] = opt_cloneDefaults ? this.clone(defaults[k]) : defaults[k];
			}
		}
	}
	return result;
};

Ops.prototype.cloneArray = function (v) {
	var result = [];
	for (var i = 0; i < v.length; i++) {
		result.push(this.clone(v[i]));
	}
	return result;
};

var ops = new Ops();
ops.Ops = Ops;

var result = {
	applyDefaults: function (options, defaults, opt_cloneDefaults) {
		return ops.applyDefaults(options, defaults, opt_cloneDefaults);
	},
	cloneWithDefaults: function (options, defaults, opt_cloneDefaults) {
		return ops.cloneWithDefaults(options, defaults, opt_cloneDefaults);
	},
	clone: function (v) {
		return ops.clone(v);
	}
};


module.exports = result;
