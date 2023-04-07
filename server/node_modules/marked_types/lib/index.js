"use strict";
var findMarker = function (type, opt_marker) {
	var result = null;
	while (type != null) {
		var marker = type.typeMarker_;
		if (marker && (!opt_marker || marker == opt_marker)) {
			result = marker;
			break;
		}
		type = type.super_;
	}
	return result;
};

var mark = function (type, id) {
	type.typeMarker_ = id;
};

var is = function (obj, type) {
	var result = false;
	if (obj != null) {
		var marker = findMarker(type);
		if (marker) {
			result = !!findMarker(obj.constructor, marker);
		}
	}
	return result;
};

module.exports = {
	mark: mark,
	is: is
};
