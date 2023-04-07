"use strict";
var inherits = require("util").inherits;
var EventEmitter = require("events").EventEmitter;
var errors = require("../../errors");

var Transport = function() {
	EventEmitter.call(this);
};
inherits(Transport, EventEmitter);

Transport.prototype.decode = function(message) {
	var msg;
	try {
		msg = JSON.parse(message);
	}
	catch (err) {
		// throw new errors.HeadersParseError(err);
	}

	return msg;
};

Transport.prototype.encode = function(id, status, headers, body) {
	var msg = {
		status: status,
		headers: headers || {},
		body: body || ""
	};

	if(id !== undefined) {
		msg.headers.id = id;
	}

	return JSON.stringify(msg);
};

Transport.prototype.send = function (connection, message) {
	connection.send(message);
	this.emit("message_sent", connection, message);
};

Transport.prototype.sendResult = function(req, res, result) {
	// NOTE must not set content-type if 204
	var message = this.encode(req.headers.id, res.statusCode, res.headers, result);
	this.send(req.connection, message);
};


module.exports = Transport;
