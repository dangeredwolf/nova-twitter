const {make, div} = require("./Helpers.js");
// const {Tweet} = require("./Tweet.js");

class TweetDetailHolder {
	tweet;
	column;

	constructor(tweet) {
		this.tweet = tweet;
		this.column = tweet.column;

		if (typeof this.tweet.retweeted_status !== "undefined") {
			tweet = this.tweet.retweeted_status;
			this.tweet = this.tweet.retweeted_status;
		}

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

		console.log(newData);

		TwitterAPI.call("https://api.twitter.com/2/timeline/conversation/" + (newData.conversation_id_str || newData.quotedTweet.conversation_id_str) +  ".json?include_reply_count=true&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended&include_ext_alt_text=true",{
			account:this.column.account
		}).then(data => {
			let timeline = data.data.timeline.instructions[0].addEntries.entries;
			let rootTweetId = data.data.timeline.instructions[0].addEntries.entries[0].content.item.content.tweet.id;

			var prependTweets = [];
			var appendTweets = [];
			var timeToAppend = false;

			if (rootTweetId === newData.id_str) {
				console.log("This tweet is the root tweet");
				let entries = data.data.timeline.instructions[0].addEntries.entries;
				for (var i in entries) {
					if (!!entries[i].content.item) {
						let convo = entries[i].content.item.content;
						console.log(convo);
						if (!!convo.conversationThread) {
							let tweets = this.findTweetsInConvo(convo.conversationThread.conversationComponents, data.data)
							console.log(tweets)
							tweets.forEach(tweet => appendTweets.push(tweet))
						}
					}
				}
			} else {
				let convo = this.findCorrectConversation(timeline, newData.id_str);
				let convoTweets = this.findTweetsInConvo(convo, data.data);
				let rootTweet = this.processConvoTweet(data.data.globalObjects.tweets[rootTweetId], data.data);

				convoTweets.unshift(rootTweet);

				if (!!rootTweet) {
					console.warn("There's no root tweet? o.O")
				}

				console.log(timeline);

				for (let i in convoTweets) {
					if (timeToAppend) {
						appendTweets.push(convoTweets[i])
					} else {
						if (convoTweets[i].id_str === newData.id_str) {
							console.log("This is the middle one!");
							timeToAppend = true;
						} else {
							prependTweets.push(convoTweets[i])
						}
					}
				}


			}
			console.log(prependTweets);
			console.log(appendTweets);

			if (prependTweets.length > 0) {
				let repliesBefore = div("tweet-detail-replies-before");
				this.column.body2.prepend(repliesBefore);

				prependTweets.forEach(tweet => repliesBefore.append(new Tweet(tweet, this.column).element));
			}

			if (appendTweets.length > 0) {
				let repliesAfter = div("tweet-detail-replies-after");
				this.column.body2.append(repliesAfter);

				appendTweets.forEach(tweet => repliesAfter.append(new Tweet(tweet, this.column).element));
			}

			console.log("Phew, I worked really hard on that")

		})

	}

	processConvoTweet(tweet, data) {
		tweet.user = data.globalObjects.users[tweet.user_id_str];
		tweet.is_quote_status = false;
		return tweet;
	}

	findTweetsInConvo(convo, data) {
		console.log(data);
		let ray = [];
		for (let j in convo) {
			if (convo[j].conversationTweetComponent &&
				convo[j].conversationTweetComponent.tweet &&
				convo[j].conversationTweetComponent.tweet.id) {
				let id = convo[j].conversationTweetComponent.tweet.id;
				ray.push(this.processConvoTweet(data.globalObjects.tweets[id], data));
			}
		}
		return ray;
	}

	findCorrectConversation(timeline, id) {
		for (let i in timeline) {
			console.log(timeline[i]);
			if (!!timeline[i].content.item) {
				if (!!timeline[i].content.item.content.conversationThread) {
					let convoComponents = timeline[i].content.item.content.conversationThread.conversationComponents;
					for (let j in convoComponents) {
						console.log(convoComponents[j]);
						if (convoComponents[j] &&
							convoComponents[j].conversationTweetComponent &&
							convoComponents[j].conversationTweetComponent.tweet &&
							convoComponents[j].conversationTweetComponent.tweet.id === id) {
							return convoComponents;
						}
					}
				}
			}
		}
	}
}

exports.TweetDetailHolder = TweetDetailHolder;
