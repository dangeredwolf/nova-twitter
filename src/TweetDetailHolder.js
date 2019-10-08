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
		);

		TwitterAPI.call("https://api.twitter.com/2/timeline/conversation/" + newData.conversation_id_str +  ".json?include_reply_count=true&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended&include_ext_alt_text=true",{
			account:this.column.account
		}).then(data => {
			let timeline = data.data.timeline.instructions[0].addEntries.entries;
			let rootTweet = data.data.timeline.instructions[0].addEntries.entries[0].content.item.content.tweet.id;
			if (rootTweet === newData.id_str) {
				console.log("This tweet is the root tweet");
			} else {
				let convo = this.findCorrectConversation(timeline, newData.id_str);
				console.log(timeline);
				console.log(this.findTweetsInConvo(convo, data.data))
			}

		})

	}

	findTweetsInConvo(convo, data) {
		console.log(data);
		let ray = [];
		for (let j in convo) {
			let id = convo[j].conversationTweetComponent.tweet.id;
			ray.push(data.globalObjects.tweets[id]);
		}
		return ray;
	}

	findCorrectConversation(timeline, id) {
		for (let i in timeline) {
			// console.log(timeline[i]);
			if (!!timeline[i].content.item.content.conversationThread) {
				let convoComponents = timeline[i].content.item.content.conversationThread.conversationComponents;
				for (let j in convoComponents) {
					// console.log(convoComponents[j]);
					if (convoComponents[j].conversationTweetComponent.tweet.id === id) {
						return convoComponents;
					}
				}
			}
		}
	}
}

exports.TweetDetailHolder = TweetDetailHolder;
