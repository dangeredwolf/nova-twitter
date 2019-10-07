const {make, div, timeAgo} = require("./Helpers.js");
const {TweetTextFormatUtils} = require("./TweetTextFormatUtils.js");
const Waves = require("node-waves");

class Tweet {
	element;
	tweetHead;
	tweetLink;
	tweetDisplayName;
	tweetUsername;
	tweetUsernameGroup;
	retweetUsernameGroup;
	tweetProfilePic;

	retweetDisplayName;
	retweetUsername;
	retweetProfilePic;

	tweetText;
	tweetBody;
	tweetTime;
	attribution;
	attributionText;

	tweetActions;
	tweetActionReply;
	tweetActionRetweet;
	tweetActionLike;
	tweetActionMore;

	tweetActionReplyCount;
	tweetActionRetweetCount;
	tweetActionLikeCount;

	tweetMediaContainer;

	attachedTweet = true; // bool: whether or not tweet is attached
	isQuotedTweet = false;
	linkInAttribution;

	attributionLink;

    interactionTime;
	interactionLink;

	data; // obj: twitter api data for this tweet/interaction
	sourceTweet;
	sourceInteractionUser;

	isInteraction = false;
	useProfilePic = true;

	constructor(data) {
		this.data = data;
		this.sourceTweet = data;

		if (typeof data.quotedTweet !== "undefined") {
			this.sourceTweet = data.quotedTweet;
			this.isQuotedTweet = true;
		}

		if (typeof this.data.retweeted_status !== "undefined" && !this.isQuotedTweet) {
			this.sourceTweet = this.data.retweeted_status;

			if (typeof this.sourceTweet.display_text_range !== "undefined") {
				this.sourceTweet.full_text = this.sourceTweet.full_text.substr(this.sourceTweet.display_text_range[0],this.data.retweeted_status.display_text_range[1]);
			}
		}

		if (typeof this.data.action !== "undefined" && !this.isQuotedTweet) {
			this.isInteraction = true;
			this.useProfilePic = false;
			this.sourceInteractionUser = this.data.sources[0];
			this.determineAttributionHeader();
			if (this.attachedTweet) {
				this.sourceTweet = this.data.targets[0];
			}

			console.log("This is an action",this.sourceTweet);

			if (typeof this.data.targets[0].retweeted_status !== "undefined") {
				this.sourceTweet = this.data.targets[0].retweeted_status;
			}
		}

		if (typeof this.data.retweeted_status !== "undefined" && !this.isQuotedTweet) {
			this.attributionText = "retweeted";
			this.sourceInteractionUser = this.data.user;
		}

		if (this.attachedTweet) {
			this.tweetDisplayName = div("tweet-display-name").text(this.sourceTweet.user.name);

		 	this.tweetUsername = div("tweet-username txt-mute").text("@" + this.sourceTweet.user.screen_name);
			if (this.useProfilePic && !this.isQuotedTweet) {
				this.tweetProfilePic = make("img").attr("src", this.sourceTweet.user.profile_image_url_https).addClass("tweet-profile-pic");
			}

			this.tweetUsernameGroup = div("tweet-username-group").append(this.tweetDisplayName, this.tweetUsername)
		}

		this.tweetLink = make("a").attr("href","https://twitter.com/" + this.sourceTweet.user.screen_name).attr("target","_blank")
						.append(this.tweetProfilePic, this.tweetUsernameGroup);

		if (!this.isQuotedTweet) {
				this.tweetTime = make("a").addClass("tweet-time txt-mute").text(timeAgo(this.sourceTweet.created_at)).attr("href","https://twitter.com/" + this.sourceTweet.user.screen_name + "/status/" + data.id_str).attr("target","_blank");
		}

		if (!!this.linkInAttribution && !this.isQuotedTweet) {
			this.interactionAttribLink = make("a").addClass("interaction-attribution-link").attr("href",this.linkInAttribution.link)
								 		 .attr("target","_blank").text(this.linkInAttribution.name)
		}

		this.tweetHead = div("tweet-header");

		let text = this.sourceTweet.full_text || this.sourceTweet.text;

		if (typeof text === "undefined") {
			text = "";
		}

		text = TweetTextFormatUtils.format(text);

		this.tweetText = make("p").addClass("tweet-text").html(text);

		this.tweetBody = div("tweet-body").append(this.tweetText);

		this.element = make("article").addClass("tweet waves-effect waves-dark").attr("data-id", data.id).attr("data-time", Date.parse(data.created_at)).append(this.tweetHead, this.tweetBody);

		if (this.useProfilePic && !this.isQuotedTweet) {
			this.element.addClass("has-profile-pic")
		}

		if (this.isQuotedTweet) {
			this.element.addClass("quote-tweet")
		}

		if ((typeof data.retweeted_status !== "undefined" || this.isInteraction) && !this.isQuotedTweet) {
			this.attribution = div("tweet-attribution").text(this.attributionText);
			this.retweetDisplayName = div("tweet-display-name retweet-display-name").text(this.sourceInteractionUser.name);

			this.retweetUsernameGroup = div("retweet-username-group tweet-username-group").append(this.retweetDisplayName);

			this.interactionLink = make("a").addClass("retweet-link").attr("href","https://twitter.com/" + this.sourceInteractionUser.screen_name).attr("target","_blank")
							   .append(this.retweetUsernameGroup);

			this.tweetHead.append(this.interactionLink, this.attribution);

			this.element.addClass("is-retweet");
		}

		this.tweetHead.append(this.tweetLink, this.tweetTime);

		if (this.attachedTweet && !this.isQuotedTweet) {
			this.tweetActionReply = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("material-icons").text("reply")
			).attr("href","#").attr("data-tooltip","Reply").attr("aria-label","Reply Button").click(() => {
				console.log("This means we should reply to this tweet");
			});

			if (this.sourceTweet.reply_count > 0)
				this.tweetActionReplyCount = div("tweet-action-count").text(this.formatInteractionCount(this.sourceTweet.reply_count));

			this.tweetActionRetweet = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("icon icon-retweet").text("repeat")
			).attr("href","#").attr("data-tooltip","Retweet").attr("aria-label","Retweet Button").click(() => {
				console.log("This means we should retweet this tweet");

			});


			if (this.sourceTweet.retweet_count > 0)
				this.tweetActionRetweetCount = div("tweet-action-count").text(this.formatInteractionCount(this.sourceTweet.retweet_count));

			this.tweetActionLike = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("icon icon-heart").text("heart")
			).attr("href","#").attr("data-tooltip","Like Tweet").attr("aria-label","Like Button").click(() => {
				console.log("This means we should like this tweet");

			});

			if (this.sourceTweet.favorite_count > 0)
				this.tweetActionLikeCount = div("tweet-action-count").text(this.formatInteractionCount(this.sourceTweet.favorite_count));

			this.tweetActionMore = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat").append(
				make("i").addClass("material-icons").text("more_horiz").attr("aria-label","Tweet Options Button")
			).attr("href","#")

			Waves.attach(
				this.tweetActionReply[0],
				this.tweetActionRetweet[0],
				this.tweetActionLike[0],
				this.tweetActionMore[0]
			)

			this.tweetActions = div("tweet-actions").append(
				this.tweetActionReply,
				this.tweetActionReplyCount,
				this.tweetActionRetweet,
				this.tweetActionRetweetCount,
				this.tweetActionLike,
				this.tweetActionLikeCount,
				this.tweetActionMore
			);



			M.Tooltip.init(
				[this.tweetActionReply[0],this.tweetActionRetweet[0],this.tweetActionLike[0]]
			);

		}

		Waves.attach(
			this.element[0]
		)

		if (this.attachedTweet || this.isQuotedTweet || this.sourceTweet.is_quote_status) {

			if (typeof this.sourceTweet.extended_entities !== "undefined" && typeof this.sourceTweet.extended_entities.media !== "undefined") {
				this.tweetMediaContainer = div("tweet-media-container");

				if (this.sourceTweet.extended_entities.media.length > 1) {
					this.tweetMediaContainer.addClass("tweet-media-container-grid tweet-media-container-grid-" + this.sourceTweet.extended_entities.media.length)
				}

				this.sourceTweet.extended_entities.media.forEach(media => {
					this.tweetMediaContainer.append(
						make("a").addClass("tweet-media").attr("href",media.expanded_url).attr("target","_blank").append(
							make("img").addClass("tweet-media-img").attr("src",media.media_url_https)
						)
					)
				})

				this.element.append(this.tweetMediaContainer)
			}

			if (this.sourceTweet.is_quote_status) {
				console.log("IM A QUOTE TWEET!!!");
				let quotedTweet = new Tweet({quotedTweet:this.sourceTweet.quoted_status});
				console.log(quotedTweet);
				this.element.append(quotedTweet.element)
			}

			this.tweetFooter = div("tweet-footer").append(this.tweetActions)
			this.element.append(this.tweetFooter);
		}

		return this;
	}

	formatInteractionCount(count) {
		if (count > 1000000) {
			return (Math.floor(count/100000)/10) + "M"
		} else if (count > 10000) {
			return (Math.floor(count/1000)) + "K"
		} else if (count > 1000) {
			return (Math.floor(count/100)/10) + "K"
		} else {
			return String(count)
		}
	}

	determineAttributionHeader() {
		switch(this.data.action) {
			case "favorite":
				this.attributionText = "liked";
				return;
			case "favorited_retweet":
				this.attributionText = "liked a Tweet you retweeted";
				break;
			case "retweet":
				this.attributionText = "retweeted";
				break;
			case "retweeted_retweet":
				this.attributionText = "retweeted a Tweet you retweeted";
				break;
			case "retweeted_mention":
				this.attributionText = "retweeted a Tweet you were mentioned in";
				break;
			case "favorited_mention":
				this.attributionText = "liked a Tweet you were mentioned in";
				break;
			case "list_member_added":
				this.attributionText = "added you to their list ";
				this.linkInAttribution = {link:("https://twitter.com/" + this.data.target_objects[0].uri), name: this.data.target_objects[0].name}
				this.attachedTweet = false;
				break;
			case "follow":
				this.attributionText = "followed you";
				this.attachedTweet = false;
				break;
			case "reply":
			case "mention":
				this.isInteraction = false;
				this.useProfilePic = true;
				break;
			default:
				console.error("Unknown interaction type " + this.data.action);
		}
	}
}

exports.Tweet = Tweet;
