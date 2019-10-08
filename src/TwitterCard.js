//  {"twitter:card":"poll2choice_text_only","twitter:api:api:endpoint":"1","twitter:string:choice1_label":"1","twitter:string:choice2_label":"2","twitter:long:duration_minutes":5}
const { TwitterAPI } = require("./TwitterAPI.js");

class TwitterCard {
	data;

	constructor(data) {
		this.data = data;
	}
}

exports.TwitterCard = TwitterCard;
