const $ = require("jquery");

exports.make = function(elementType) {
	return $(document.createElement(elementType));
}

exports.div = function(className) {
    return $(document.createElement("div")).addClass(className);
}

exports.timeAgo = function(compareDate) {
	return exports.formatTimeAgo(exports.timeAgoRaw(compareDate));
}

exports.timeAgoRaw = function(compareDate) {
	let currentTime = new Date().getTime();
	let oldTime = Date.parse(compareDate);
	let difference = (currentTime - oldTime) / 1000; // Results in time in milliseconds

	return difference;
}

exports.formatTimeAgo = function (seconds) {
	if (seconds < 60) {
		return Math.floor(seconds) + "s"
	} else if (seconds < 60*60) {
		return Math.floor(seconds/60) + "m"
	} else if (seconds < 60*60*24) {
		return Math.floor(seconds/60/60) + "h"
	} else {
		return Math.floor(seconds/60/60/24) + "d"
	}
}

exports.body = $(document.body);
exports.head = $(document.head);
