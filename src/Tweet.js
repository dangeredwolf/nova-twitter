const {make, div, timeAgo} = require("./Helpers.js");
const {TweetTextFormatUtils} = require("./TweetTextFormatUtils.js");

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

	attachedTweet = true; // bool: whether or not tweet is attached
	linkInAttribution;

	attributionLink;

    interactionTime;
	interactionLink;

	data; // obj: twitter api data for this tweet/interaction
	sourceTweet;
	sourceInteractionUser;

	isInteraction = false;

	constructor(data) {
		this.data = data;
		this.sourceTweet = data;

		if (typeof this.data.retweeted_status !== "undefined") {
			this.sourceTweet = this.data.retweeted_status;

			if (typeof this.sourceTweet.display_text_range !== "undefined") {
				this.sourceTweet.full_text = this.sourceTweet.full_text.substr(this.sourceTweet.display_text_range[0],this.data.retweeted_status.display_text_range[1]);
			}
		}

		if (typeof this.data.action !== "undefined") {
			this.isInteraction = true;
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

		if (typeof this.data.retweeted_status !== "undefined") {
			this.sourceInteractionUser = this.data.retweeted_status.user;
		}

		if (this.attachedTweet) {
			this.tweetDisplayName = div("tweet-display-name").text(this.sourceTweet.user.name);

		 	this.tweetUsername = div("tweet-username txt-mute").text("@" + this.sourceTweet.user.screen_name);
			this.tweetProfilePic = make("img").attr("src", this.sourceTweet.user.profile_image_url_https).addClass("tweet-profile-pic");

			this.tweetUsernameGroup = div("tweet-username-group").append(this.tweetDisplayName, this.tweetUsername)
		}

		this.tweetLink = make("a").attr("href","https://twitter.com/" + this.sourceTweet.user.screen_name).attr("target","_blank")
						.append(this.tweetProfilePic, this.tweetUsernameGroup);
		this.tweetTime = make("a").addClass("tweet-time txt-mute").text(timeAgo(this.sourceTweet.created_at)).attr("href","https://twitter.com/" + this.sourceTweet.user.screen_name + "/status/" + data.id_str).attr("target","_blank");

		if (!!this.linkInAttribution) {
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

		this.element = make("article").addClass("tweet has-profile-pic").attr("data-id", data.id).attr("data-time", Date.parse(data.created_at)).append(this.tweetHead, this.tweetBody);


		if (typeof data.retweeted_status !== "undefined" || this.isInteraction) {
			this.attribution = div("tweet-attribution").text(this.attributionText);
			this.retweetDisplayName = div("tweet-display-name retweet-display-name").text(this.sourceInteractionUser.name);

			this.retweetUsernameGroup = div("retweet-username-group tweet-username-group").append(this.retweetDisplayName);

			this.interactionLink = make("a").addClass("retweet-link").attr("href","https://twitter.com/" + this.sourceInteractionUser.screen_name).attr("target","_blank")
							   .append(this.retweetUsernameGroup);

			this.tweetHead.append(this.interactionLink, this.attribution);

			this.element.addClass("is-retweet");
		}

		this.tweetHead.append(this.tweetLink, this.tweetTime);

		if (this.attachedTweet) {
			this.tweetActionReply = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").html(
				make("i").addClass("material-icons").text("reply")
			).attr("href","#").attr("data-tooltip","Reply")

			this.tweetActionRetweet = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").html(
				make("i").addClass("icon icon-retweet").text("repeat")
			).attr("href","#").attr("data-tooltip","Retweet")

			this.tweetActionLike = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").html(
				make("i").addClass("icon icon-heart").text("heart")
			).attr("href","#").attr("data-tooltip","Like Tweet")

			this.tweetActionMore = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat").html(
				make("i").addClass("material-icons").text("more_horiz")
			).attr("href","#")

			Waves.attach(
				this.tweetActionReply[0],
				this.tweetActionRetweet[0],
				this.tweetActionLike[0],
				this.tweetActionMore[0]
			)

			this.tweetActions = div("tweet-actions").append(
				this.tweetActionReply,
				this.tweetActionRetweet,
				this.tweetActionLike,
				this.tweetActionMore
			);

			this.tweetFooter = div("tweet-footer").append(this.tweetActions)

			this.element.append(this.tweetFooter);

			M.Tooltip.init(
				[this.tweetActionReply[0],this.tweetActionRetweet[0],this.tweetActionLike[0]]
			)

		}

		return this;
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
				break;
			default:
				console.error("Unknown interaction type " + this.data.action);
		}
	}
}

exports.Tweet = Tweet;
