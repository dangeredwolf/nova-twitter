const $ = require("jquery");

exports.apiBase = "https://api.twitter.com/1.1";

exports.latestIdText = function(id) {
	return (id > 0 ? ("&since_id="+id) : "")
}
exports.earliestIdText = function(id) {
	return (id > 0 ? ("&max_id="+id) : "")
}

exports.appendApiFeatures = "?model_version=7&count=20&skip_aggregation=true&include_my_retweet=1&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&include_reply_count=true&tweet_mode=extended&include_ext_alt_text=true";

exports.buildApiUrl = function(obj) {
	return exports.apiBase + obj.endpoint + exports.appendApiFeatures + (obj.loadBackwards ? exports.earliestIdText(obj.id) : exports.latestIdText(obj.id)) + (!!obj.parameters ? obj.parameters : "");
}

exports.make = function(elementType) {
	return $(document.createElement(elementType));
}

exports.div = function(className) {
    return $(document.createElement("div")).addClass(className);
}

exports.timeAgo = function(compareDate) {
	return exports.formatTimeAgo(exports.timeAgoRaw(compareDate));
}

exports.assert = function(compare, message) {
	if (!compare) {
		throw (message || "Assertion failed")
	}
}

exports.timeAgoRaw = function(compareDate) {
	let currentTime = new Date().getTime();
	let oldTime = Date.parse(compareDate);

	if (isNaN(oldTime)) {
		oldTime = parseInt(compareDate) || compareDate;
	}

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
