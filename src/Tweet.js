const {make, div, timeAgo, timeAgoRaw} = require("./Helpers.js");
const {TweetTextFormatUtils} = require("./TweetTextFormatUtils.js");
const {TweetDetailHolder} = require("./TweetDetailHolder.js");
const {ProviderLikeTweet} = require("./ProviderLikeTweet.js");
const {ProfileMiniCard} = require("./ProfileMiniCard.js");
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

	avatarHoverTimeout;

	column;

	constructor(data, column) {
		this.data = data;
		this.column = column;
		this.sourceTweet = data;

		console.log(data)

		if (typeof data.quotedTweet !== "undefined") {
			this.sourceTweet = data.quotedTweet;
			this.isQuotedTweet = true;

			if (this.data.is_detail_holder) {
				this.isQuotedTweet = false;
			}
		}

		if (typeof this.data.retweeted_status !== "undefined" && !this.isQuotedTweet) {
			this.sourceTweet = this.data.retweeted_status;

			// if (typeof this.sourceTweet.display_text_range !== "undefined") {
			// 	this.sourceTweet.full_text = this.sourceTweet.full_text.substr(this.sourceTweet.display_text_range[0],this.data.retweeted_status.display_text_range[1]);
			// }
		}

		if (typeof this.data.action !== "undefined" && !this.isQuotedTweet) {
			this.isInteraction = true;
			this.useProfilePic = false;
			this.sourceInteractionUser = this.data.sources[0];
			this.determineAttributionHeader();
			if (this.attachedTweet) {
				this.sourceTweet = this.data.targets[0];
			} else {
				this.sourceTweet = {user:this.data.sources[0]};
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
			// console.log(this.sourceTweet);
			this.tweetDisplayName = div("tweet-display-name").text(this.sourceTweet.user.name);

		 	this.tweetUsername = div("tweet-username txt-mute").text("@" + this.sourceTweet.user.screen_name);

			this.tweetUsernameGroup = div("tweet-username-group").append(this.tweetDisplayName, this.tweetUsername)
		}

		if ((this.useProfilePic && !this.isQuotedTweet)) {
			this.tweetProfilePic = make("img")
			.attr("src", this.sourceTweet.user.profile_image_url_https).addClass("tweet-profile-pic")
			.on("mouseover",() => {
				if (this.avatarHoverTimeout) {
					clearTimeout(this.avatarHoverTimeout);
					this.avatarHoverTimeout = undefined;
				}
				this.avatarHoverTimeout = setTimeout(() => {
					console.log("Open profile mini card");
					new ProfileMiniCard(this.sourceTweet.user, this.tweetProfilePic.offset());
				}, 700);
			}).on("mouseout",() => {
				if (this.avatarHoverTimeout) {
					clearTimeout(this.avatarHoverTimeout);
					this.avatarHoverTimeout = undefined;
				}
			})
		}

		this.tweetLink = make("a").attr("target","_blank").attr("href","https://twitter.com/" + this.sourceTweet.user.screen_name)
						 .append(this.tweetProfilePic, this.tweetUsernameGroup);



		if (!this.isQuotedTweet) {
				this.tweetTime = make("a").addClass("tweet-time txt-mute").text(timeAgo(this.sourceTweet.created_at))
				.attr("href","https://twitter.com/" + this.sourceTweet.user.screen_name + "/status/" + this.sourceTweet.id_str).attr("target","_blank")
				.click(e => e.stopPropagation());

				if (timeAgoRaw(this.sourceTweet.created_at) < 60) { // 60 seconds
					var interval = setInterval(() => {
						this.tweetTime.text(timeAgo(this.sourceTweet.created_at))
						if (timeAgoRaw(this.sourceTweet.created_at) > 60) { // 60 seconds
							console.log("it's time to stop :D");
							clearInterval(interval);
						}
					}, 500)
				}
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

		this.findLinks(text, this.sourceTweet).forEach(link => {
			if (link.mtd_unused_link) {
				text = text.replace(new RegExp(link.url,"g"),"")
			} else {
				text = text.replace(new RegExp(link.url,"g"),"<a class=\"tweet-link-inline\" target=\"_blank\" href=\"" + link.url + "\">" + link.display_url + "</a>");
			}

		})

		this.findUsers(text, this.sourceTweet).forEach(user => {
			console.log(user);
			text = text.replace(new RegExp("@" + user.screen_name,"g"),"<a class=\"tweet-link-inline tweet-link-user\" target=\"_blank\" href=\"https://twitter.com/" + user.screen_name + "\"> @" + user.screen_name + "</a>");
		})

		this.tweetText = make("p").addClass("tweet-text").html(text);

		this.tweetBody = div("tweet-body").append(this.tweetText);

		this.element = make("article").addClass("tweet").attr("data-id", data.id)
					   .attr("data-time", Date.parse(data.created_at)).append(this.tweetHead, this.tweetBody);


		if (!this.data.is_detail_holder && this.attachedTweet) {
			this.element.addClass("waves-effect waves-dark").click(() => {
				new TweetDetailHolder(this);
			});
		} else {
			this.data.disableActionButtons = false;
		}

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
							   .append(this.retweetUsernameGroup).click(e => e.stopPropagation());

			this.tweetHead.append(this.interactionLink, this.attribution);

			this.element.addClass("is-retweet");
		}

		this.tweetHead.append(this.tweetLink, this.tweetTime);

		if (this.attachedTweet && !this.isQuotedTweet && !(this.data.disableActionButtons)) {
			this.tweetActionReply = make("a").addClass("tweet-action tweet-action-reply waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("material-icons").text("reply")
			).attr("href","#").attr("data-tooltip","Reply").attr("aria-label","Reply Button").click(e => {
				console.log("This means we should reply to this tweet");
				e.stopPropagation();
			});

			if (this.sourceTweet.reply_count > 0)
				this.tweetActionReplyCount = div("tweet-action-count").text(this.formatInteractionCount(this.sourceTweet.reply_count));

			this.tweetActionRetweet = make("a").addClass("tweet-action tweet-action-retweet waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("icon icon-retweet").text("repeat")
			).attr("href","#").attr("data-tooltip","Retweet").attr("aria-label","Retweet Button").click(e => {
				console.log("This means we should retweet this tweet");
				e.stopPropagation();
				new ModalRetweet({tweet:this}).display();
			});

			if (this.sourceTweet.retweeted)
				this.tweetActionRetweet.addClass("activated")

			if (this.sourceTweet.retweet_count > 0)
				this.tweetActionRetweetCount = div("tweet-action-count").text(this.formatInteractionCount(this.sourceTweet.retweet_count));

			this.tweetActionLike = make("a").addClass("tweet-action tweet-action-like waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("icon icon-heart").text("heart")
			).attr("href","#").attr("data-tooltip","Like Tweet").attr("aria-label","Like Button").click(e => {
				console.log("This means we should like this tweet");
				e.stopPropagation();
				if (this.tweetActionLike.hasClass("activated")) {
					this.tweetActionLike.removeClass("activated");
					ProviderLikeTweet.unlike(this.sourceTweet, this.column.account).then((res) => {
						console.log(res);
					}).catch(e => {
						if (e.response && e.response.data && e.response.data && e.response.data.errors && e.response.data.errors[0] && e.response.data.errors[0].message === "No status found with that ID.") {
							console.log("Oh, it's ok, the fave didn't actually exist")
						} else {
							this.tweetActionLike.addClass("activated");
						}
						console.log(e);
					})
				} else {
					this.tweetActionLike.addClass("activated");
					ProviderLikeTweet.like(this.sourceTweet, this.column.account).then((res) => {
						console.log(res);
					}).catch(e => {
						if (e.response && e.response.data && e.response.data && e.response.data.errors && e.response.data.errors[0] && e.response.data.errors[0].message === "You have already favorited this status.") {
							console.log("Oh, it's ok, we already faved it.")
						} else {
							this.tweetActionLike.removeClass("activated");
						}
						console.log(e);
					})
				}


			});

			if (this.sourceTweet.favorited)
				this.tweetActionLike.addClass("activated")

			if (this.sourceTweet.favorite_count > 0)
				this.tweetActionLikeCount = div("tweet-action-count").text(this.formatInteractionCount(this.sourceTweet.favorite_count));

			this.tweetActionMore = make("a").addClass("tweet-action tweet-action-more waves-effect waves-dark waves-circle btn-small btn-flat").append(
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

		if (!this.data.is_detail_holder) {
			Waves.attach(
				this.element[0]
			)
		}

		if (this.attachedTweet || this.isQuotedTweet || this.sourceTweet.is_quote_status) {

			if (typeof this.sourceTweet.extended_entities !== "undefined" && typeof this.sourceTweet.extended_entities.media !== "undefined") {
				this.tweetMediaContainer = div("tweet-media-container");

				if (this.sourceTweet.extended_entities.media.length > 1) {
					this.tweetMediaContainer.addClass("tweet-media-container-grid tweet-media-container-grid-" + this.sourceTweet.extended_entities.media.length)
				}

				this.sourceTweet.extended_entities.media.forEach(media => {
					if (!media.video_info || !this.data.is_detail_holder) {
						this.tweetMediaContainer.append(
							make("a").addClass("tweet-media").attr("href",media.expanded_url).attr("target","_blank").click(e => e.stopPropagation()).append(
								make("div").addClass("tweet-media-img").attr("style","background-image:url(\""+media.media_url_https+"\")")
							)
						)
					} else if (!!media.video_info && !!this.data.is_detail_holder) {
						let url;
						let max_bitrate = 0;

						media.video_info.variants.forEach(variant => {
							if (variant.content_type === "video/mp4") {
								if (variant.bitrate > max_bitrate) {
									max_bitrate = variant.bitrate;
									url = variant.url;
								}
							}
						})
						this.tweetMediaContainer.append(
							make("iframe").attr("allowfullscreen","true").attr("frameborder","0").attr("src",url).addClass("tweet-media-video")
						)
					}
				})

				this.element.append(this.tweetMediaContainer)
			}

			if (this.sourceTweet.is_quote_status && !!this.sourceTweet.quoted_status) {
				console.log("IM A QUOTE TWEET!!!");
				let quotedTweet = new Tweet({quotedTweet:this.sourceTweet.quoted_status}, this.column);
				console.log(quotedTweet);
				this.element.append(quotedTweet.element);
				quotedTweet.element.click(e => e.stopPropagation())
			}

			this.tweetFooter = div("tweet-footer").append(this.tweetActions)
			this.element.append(this.tweetFooter);
		}

		return this;
	}

	findLinks(text, tweet) {
		let arr = [];
		(text.match(/https?:\/\/t\.co\/[a-zA-Z0-9]+/g) || []).forEach(link => {
			let foundLink = false;
			for (let i in tweet.entities.urls) {
				let letsSee = tweet.entities.urls[i];
				if (letsSee.url === link) {
					foundLink = true;
					arr.push(letsSee);
				}
			}
			if (!foundLink) {
				arr.push({url:link,mtd_unused_link:true})
			}
		});
		return arr;
	}

	findUsers(text, tweet) {
		let arr = [];
		(text.match(/@[a-zA-Z0-9_]{1,15}(?=\b)/g) || []).forEach(username => {
			for (let i in tweet.entities.user_mentions) {
				let letsSee = tweet.entities.user_mentions[i];
				if (("@" + letsSee.screen_name) === username) {
					arr.push(letsSee);
				}
			}
		});
		return arr;
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
