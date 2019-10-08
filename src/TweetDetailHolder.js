const {make, div} = require("./Helpers.js");
// const {Tweet} = require("./Tweet.js");

class TweetDetailHolder {
	tweet;
	column;

	constructor(tweet) {
		this.tweet = tweet;
		this.column = tweet.column;

		this.column.element.removeClass("column-level-1").addClass("column-level-2");

		let newData = this.tweet.data;
		if (typeof newData.targets !== "undefined") {
			newData = newData.targets[0]
		}
		newData.is_detail_holder = true;


		let makeTweet = new Tweet(newData, this.column);

		this.column.body2.html("").append(
			div("tweet-detail-wrapper").append(
				makeTweet.element
			)
		)

	}
}

exports.TweetDetailHolder = TweetDetailHolder;
