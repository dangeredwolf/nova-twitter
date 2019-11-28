const {make, div, timeAgo, timeAgoRaw} = require("./Helpers.js");
const {TweetTextFormatUtils} = require("./TweetTextFormatUtils.js");
const {TweetDetailHolder} = require("./TweetDetailHolder.js");
const {ProviderLikeTweet} = require("./ProviderLikeTweet.js");
const {ProfileMiniCard} = require("./ProfileMiniCard.js");
const {Dropdown} = require("./Dropdown.js");
const {Media} = require("./Media.js");
const {TweetDropdown} = require("./TweetDropdown.js");
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

	user = {
		parent:null,

		set name(val) {
			this.__name = val;
			console.log(this.parent);
			this.parent.tweetDisplayName.text(val);
		},

		get name() {
			return this.__name;
		},

		set screen_name(val) {
			this.__screen_name = val;
			console.log(this.parent);
			this.parent.tweetUsername.text("@" + val);
		},

		get screen_name() {
			return this.__screen_name;
		},

		set profile_image_url_https(val) {
			this.__profile_image_url_https = val;
			console.log(this.parent);
			this.parent.tweetProfilePic.attr("src", val)
		},

		get profile_image_url_https() {
			return this.__profile_image_url_https;
		}
	};

	constructor(data, column) {
		this.data = data;
		this.column = column;
		this.sourceTweet = data;

		console.debug(data)

		if (typeof this.data.quotedTweet !== "undefined") {
			this.sourceTweet = this.data.quotedTweet;
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

			console.debug("This is an action",this.sourceTweet);

			if (typeof this.data.targets[0].retweeted_status !== "undefined") {
				this.sourceTweet = this.data.targets[0].retweeted_status;
			}
		}

		if (typeof this.data.retweeted_status !== "undefined" && !this.isQuotedTweet) {
			this.attributionText = "retweeted";
			this.sourceInteractionUser = this.data.user;
		}

		if (typeof this.sourceTweet === "undefined") {
			console.debug("We couldn't find a source tweet, so we'll treat it as if it doesn't have one.");
			this.attachedTweet = false;
		} else if (!!this.sourceTweet.id) {
			if (!window.Tweets[this.sourceTweet.id]) {
				window.Tweets[this.sourceTweet.id] = []
			}
			window.Tweets[this.sourceTweet.id].push(this);
		} else if (!!this.sourceTweet.user) {
			if (!window.UserCache[this.sourceTweet.user.id]) {
				window.UserCache[this.sourceTweet.user.id] = []
			}
			window.UserCache[this.sourceTweet.user.id].push(this);
		}

		if (typeof this.sourceTweet.profile_background_tile !== "undefined") {
			console.debug("This is a notification without a tweet (i.e. follow)");
			this.attachedTweet = false;
		}
		this.tweetDisplayName = div("tweet-display-name");
		this.tweetUsername = div("tweet-username txt-mute");
		this.tweetUsernameGroup = div("tweet-username-group").append(this.tweetDisplayName, this.tweetUsername)
		this.tweetProfilePic = make("img").addClass("tweet-profile-pic")

		if (!this.useProfilePic || this.isQuotedTweet || this.composeAttachment) {
			this.tweetProfilePic.addClass("hidden")
		}

		this.tweetLink = make("a").attr("target","_blank").attr("href","https://twitter.com/" + (this.user.screen_name))
						 .append(this.tweetProfilePic, this.tweetUsernameGroup)

		this.attachTweetLinkEvents(this.tweetLink);

		if (!!this.linkInAttribution && !this.isQuotedTweet) {
			this.interactionAttribLink = make("a").addClass("interaction-attribution-link").attr("href",this.linkInAttribution.link)
								 		 .attr("target","_blank").text(this.linkInAttribution.name)

			this.attachTweetLinkEvents(this.interactionAttribLink);
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
			console.debug(user);
			text = text.replace(new RegExp("@" + user.screen_name,"g"),"<a class=\"tweet-link-inline tweet-link-user\" target=\"_blank\" href=\"https://twitter.com/" + user.screen_name + "\"> @" + user.screen_name + "</a>");
		})

		this.findTags(text, this.sourceTweet).forEach(tag => {
			console.debug(tag);
			text = text.replace(new RegExp("#" + tag.text,"g"),"<a class=\"tweet-link-inline tweet-link-tag\" target=\"_blank\" href=\"https://twitter.com/hashtag/" + tag.text + "\"> #" + tag.text + "</a>");
		})

		this.tweetText = make("p").addClass("tweet-text").html(text);

		this.tweetBody = div("tweet-body").append(this.tweetText);

		this.element = make("article").addClass("tweet").append(this.tweetHead, this.tweetBody);


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

		this.tweetTime = make("a").addClass("tweet-time txt-mute");

		this.tweetHead.append(this.tweetLink, this.tweetTime);

		if (this.attachedTweet && !this.isQuotedTweet && !(this.data.disableActionButtons) && !this.composeAttachment) {
			this.tweetActionReply = make("a").addClass("tweet-action tweet-action-reply waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("material-icons").text("reply")
			).attr("href","#").attr("data-tooltip","Reply").attr("aria-label","Reply Button").click(e => {
				console.log("This means we should reply to this tweet");
				composeController.replyTo = this.sourceTweet;
				e.stopPropagation();
			});

			this.tweetActionReplyCount = div("tweet-action-count");

			this.tweetActionRetweet = make("a").addClass("tweet-action tweet-action-retweet waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("icon icon-retweet").text("repeat")
			).attr("href","#").attr("data-tooltip","Retweet").attr("aria-label","Retweet Button").click(e => {
				console.log("This means we should retweet this tweet");
				e.stopPropagation();
				new ModalRetweet({tweet:this}).display();
			});
			this.tweetActionRetweetCount = div("tweet-action-count");

			this.tweetActionLike = make("a").addClass("tweet-action tweet-action-like waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").append(
				make("i").addClass("icon icon-heart").text("heart")
			).attr("href","#").attr("data-tooltip","Like Tweet").attr("aria-label","Like Button");
			this.tweetActionLike.click(e => {
				console.log("This means we should like this tweet");
				e.stopPropagation();
				if (this.tweetActionLike && this.tweetActionLike.hasClass("activated")) {
					this.favorited = false;
					console.log(this.favorite_count);
					this.favorite_count--;
					ProviderLikeTweet.unlike(this.sourceTweet, this.column.account).then((res) => {
						console.log(res);
					}).catch(e => {
						if (e.response && e.response.data && e.response.data.errors
							&& e.response.data.errors[0] && e.response.data.errors[0].message ===
							"No status found with that ID.") {

							console.log("Oh, it's ok, the fave didn't actually exist")
						} else {
							this.favorited = true;
							this.favorite_count++;

							let errMsg = e;
							try {
								errMsg = e.errors[0].message;
							} catch(ee) {}
							M.toast({html: errMsg});
						}
						console.log(e);
					})
				} else if (this.tweetActionLike) {
					this.favorited = true;
					this.favorite_count++;
					this.tweetActionLike.addClass("activated");
					ProviderLikeTweet.like(this.sourceTweet, this.column.account).then((res) => {
						console.log(res);
					}).catch(e => {
						if (e.response && e.response.data && e.response.data.errors &&
							e.response.data.errors[0] && e.response.data.errors[0].message ===
							"You have already favorited this status.") {

							console.log("Oh, it's ok, we already faved it.")
						} else {
							this.favorited = false;
							this.favorite_count--;

							let errMsg = e;
							try {
								errMsg = e.errors[0].message;
							} catch(ee) {}
							M.toast({html: errMsg});
						}
						console.log(e);
					})
				}
			});
			this.tweetActionLikeCount = div("tweet-action-count");

			this.tweetActionMore = make("a").addClass("tweet-action tweet-action-more waves-effect waves-dark waves-circle btn-small btn-flat").append(
				make("i").addClass("material-icons").text("more_horiz").attr("aria-label","Tweet Options Button")
			).attr("href","#").click(e => {
				console.log("This means we should open the dropdown");
				e.stopPropagation();

				$(document.body).append(new Dropdown(TweetDropdown, this.sourceTweet, this.tweetActionMore.offset()).element);
			});

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

		this.tweetFooter = div("tweet-footer").append(this.tweetActions);
		this.element.append(this.tweetFooter);

		if (typeof this.sourceTweet !== "undefined") {
			let user = this.sourceTweet.user || this.sourceTweet;

			this.user.parent = this;

			for (let prop in user) {
				this.user[prop] = user[prop];
			}
		}

		for (let prop in this.sourceTweet) {
			this[prop] = this.sourceTweet[prop];
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

	attachTweetLinkEvents(link) {
		link.on("mouseover",() => {
		   if (this.avatarHoverTimeout) {
			   clearTimeout(this.avatarHoverTimeout);
			   this.avatarHoverTimeout = undefined;
		   }
		   this.avatarHoverTimeout = setTimeout(() => {
			   console.log("Open profile mini card");
			   new ProfileMiniCard(this.user || this.sourceTweet, this.tweetProfilePic ? this.tweetProfilePic.offset() : link.offset());
		   }, 700);
	   }).on("mouseout",() => {
		   if (this.avatarHoverTimeout) {
			   clearTimeout(this.avatarHoverTimeout);
			   this.avatarHoverTimeout = undefined;
		   }
	   })
	}

	attachTimekeeper(tweetTime) {
		var interval = setInterval(() => {
			tweetTime.text(timeAgo(this.sourceTweet.created_at))
			if (timeAgoRaw(this.sourceTweet.created_at) > 60) { // 60 seconds
				console.log("it's time to stop :D");
				clearInterval(interval);
			}
		}, 500)
	}

	findTags(text, tweet) {
		let arr = [];
		(text.match(/#[a-zA-Z0-9_]+(?=\b)/g) || []).forEach(tag => {
			for (let i in tweet.entities.hashtags) {
				let letsSee = tweet.entities.hashtags[i];
				if (("#" + letsSee.text) === tag) {
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

	updateQuotedStatus(isQuoteStatus, quotedStatus) {
		if (this.sourceTweet.is_quote_status && !!this.sourceTweet.quoted_status && !this.quotedTweet) {
			console.debug("IM A QUOTE TWEET!!!");
			this.quotedTweet = new Tweet({quotedTweet:this.sourceTweet.quoted_status}, this.column);
			this.element.append(this.quotedTweet.element);
			this.quotedTweet.element.click(e => e.stopPropagation())
		}
	}

	set id(val) {
		this.element.attr("data-id", val);
		this.sourceTweet.id = val;
	}

	get id() {
		return this.sourceTweet.id;
	}

	set reply_count(val) {
		if (this.tweetActionReplyCount) {
			if (val !== 0) {
				this.tweetActionReplyCount.text(this.formatInteractionCount(val));
			} else {
				this.tweetActionReplyCount.text("");
			}
		}
		this.sourceTweet.reply_count = val;
	}

	get reply_count() {
		return this.sourceTweet.reply_count;
	}

	set favorite_count(val) {
		if (this.tweetActionLikeCount) {
			if (val !== 0) {
				this.tweetActionLikeCount.text(this.formatInteractionCount(val));
			} else {
				this.tweetActionLikeCount.text("");
			}
		}
		this.sourceTweet.favorite_count = val;
	}

	get favorite_count() {
		return this.sourceTweet.favorite_count;
	}

	set retweet_count(val) {
		if (this.tweetActionRetweetCount) {
			if (val !== 0) {
				this.tweetActionRetweetCount.text(this.formatInteractionCount(val));
			} else {
				this.tweetActionRetweetCount.text("");
			}
		}

		this.sourceTweet.retweet_count = val;
	}

	get retweet_count() {
		return this.sourceTweet.retweet_count;
	}

	set is_quote_status(val) {
		this.updateQuotedStatus(val, this.quoted_status);
		this.sourceTweet.is_quote_status = val;
	}

	get is_quote_status() {
		return this.sourceTweet.is_quote_status;
	}

	set quoted_status(val) {
		this.updateQuotedStatus(this.is_quote_status, val);
		this.sourceTweet.quoted_status = val;
	}

	get quoted_status() {
		return this.sourceTweet.quoted_status;
	}

	set favorited(val) {
		if (val && this.tweetActionLike) {
			this.tweetActionLike.addClass("activated");
		} else if (!val && this.tweetActionLike) {
			this.tweetActionLike.removeClass("activated");
		}
		this.sourceTweet.favorited = val;
	}

	get favorited() {
		return this.sourceTweet.favorited;
	}

	set retweeted(val) {
		if (val && this.tweetActionRetweet) {
			this.tweetActionRetweet.addClass("activated");
		} else if (!val && this.tweetActionRetweet) {
			this.tweetActionRetweet.removeClass("activated");
		}
		this.sourceTweet.retweeted = val;
	}

	get retweeted() {
		return this.sourceTweet.retweeted;
	}

	set created_at(time) {
		this.element.attr("data-time", Date.parse(time));

		if (!this.isQuotedTweet) {
			this.tweetTime.text(timeAgo(time))
			.attr("href","https://twitter.com/" + this.user.screen_name + "/status/" + this.sourceTweet.id_str).attr("target","_blank")
			.click(e => e.stopPropagation());

			if (timeAgoRaw(time) < 60) { // 60 seconds
				this.attachTimekeeper(this.tweetTime)
			}
		}
		this.sourceTweet.created_at = time;
	}

	get created_at() {
		return this.sourceTweet.created_at
	}

	set extended_entities(entities) {
		if (typeof entities !== "undefined" && typeof entities.media !== "undefined") {
			this.tweetMediaContainer = div("tweet-media-container");

			if (entities.media.length > 1) {
				this.tweetMediaContainer.addClass("tweet-media-container-grid tweet-media-container-grid-" + entities.media.length)
			}

			entities.media.forEach(media => {
				if (!media.video_info || !this.data.is_detail_holder) {
					this.tweetMediaContainer.append(
						new Media(media.media_url_https,{display_url:media.expanded_url,tweet:this,num:this.tweetMediaContainer.children().length}).element
					)
				} else if (!!media.video_info && !!this.data.is_detail_holder) {

					let url = Media.getBestMediaVariant(media.video_info.variants);

					this.tweetMediaContainer.append(
						new Media(url,{type:"video",tweet:this,num:this.tweetMediaContainer.children().length}).element
					)
				}
			})

			this.element.append(this.tweetMediaContainer)
		}
		this.sourceTweet.extended_entities = entities;
	}

	get extended_entities() {
		return this.sourceTweet.extended_entities;
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
