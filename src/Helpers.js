const $ = require("jquery");

exports.make = function(a) {
	return $(document.createElement(a));
}

exports.div = function(a) {
    return $(document.createElement("div")).addClass(a);
}

exports.body = $(document.body);
exports.head = $(document.head);
