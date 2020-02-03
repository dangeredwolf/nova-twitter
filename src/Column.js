const $ = require("jquery");
const { div, make } = require("./Helpers.js");
const { ColumnHolder } = require("./ColumnHolder.js");
const { ColumnInteractions } = require("./ColumnInteractions.js");
const { Tweet } = require("./Tweet.js");
const { Filter } = require("./Filter.js");
const Waves = require("node-waves");

class Column {

    element;
    headElement1;
    icon;
    columnTitle;
    columnUsername;
    body1;
	account;
	wrapper1;

	back2;

    displayedIds = {};
    latestId = 0;
    earliestId = 99**9;
    shouldReverse = false;
    isLoadingMore = false;

	shouldCatchErrs = false;
	pauseColumnIfErrored = true;

    filters = {};
    settings = {};
	queuedTweets = [];
	tweetLimit = 50;

	lastUpdated = 0;


    constructor(user, filters, settings) {
        this.element = div("column column-level-1");
        this.columnTitle = div("column-title");
        this.columnUsername = div("column-username");
        this.icon = make("i").addClass("material-icons");
        this.headElement1 = div("column-header").append(this.icon,this.columnTitle, this.columnUsername);
		this.back2 = make("a").text("Tweet").prepend(
						make("i").addClass("material-icons").text("arrow_back")
					).attr("href","#").addClass("column-header-link waves-effect waves-light").mouseup(() => {
						this.element.removeClass("column-level-2").addClass("column-level-1")
					});
        this.headElement2 = div("column-header").append(
			this.back2
		);

		Waves.attach(
			this.back2[0]
		);
        this.body1 = div("column-body scroll-v");
        this.body2 = div("column-body scroll-v");
		this.wrapper1 = div("column-wrapper column-wrapper-level-1").append(this.headElement1, this.body1);
		this.wrapper2 = div("column-wrapper column-wrapper-level-2").append(this.headElement2, this.body2);
        this.element.append(this.wrapper1,this.wrapper2);
        this.filters = filters || {};
        this.settings = settings || {};

		for (let setting in this.settings) {
			if (setting === "media_preview_size") {
				this.element.addClass("column-settings-media_preview_size-" +  this.settings[setting])
			}
		}

        this.body1.scroll(() => {
            if ($(this.body1).scrollTop() + $(this.body1).height() > $(this.body1).prop("scrollHeight") - 200) {
    			if (!this.isLoadingMore) {
                    console.debug("im actually screaming")
                    this.isLoadingMore = true;

                    this.renderTweets(this.earliestId).catch(e => {
                        let errMsg = e.data;
                        try {
                            errMsg = e.data.errors[0].message;
                        } catch(ee) {}
                        M.toast({html: errMsg})
                    }).then(e => {
                        this.isLoadingMore = false
                    })
                }
       		} else if ($(this.body1).scrollTop() === 0) {
				console.log(this.queuedTweets)
				this.queuedTweets.forEach(tweet => {
					console.log(tweet);
					this.body1.prepend(tweet.element);
				});

				this.queuedTweets = []
			}
        })

        return this;
    }

    placeInHolder() {
        console.debug("placeInHolder");
        $(".column-holder").append(this.element);
        return this;
    }

    updateTweets() {
        // base Column class doesn't have update logic
        return this;
    }

    renderTimer() {
        // setInterval(() => {
        //     this.renderTweetsWrapper();
        // }, 10000);
        setTimeout(() => {
            this.renderTweetsWrapper();
        }, 0);
		return this;
    }

	apiThrottleHook(headers) {
		let limit = headers["x-rate-limit-limit"];
		let remaining = headers["x-rate-limit-remaining"];
		let reset = headers["x-rate-limit-reset"];

		let percentage = remaining / limit;
		let timeLeft = Math.min(15*60,(new Date(reset*1000) - new Date())/1000);

		let throttleTime = Math.max(1500, (timeLeft / remaining) * 1500);

		if (throttleTime > timeLeft*1000) {
			console.warn("Warning: Throttle time exceeded timeLeft")
			throttleTime = timeLeft*1000
		}

		console.warn((throttleTime/1000) + " seconds ("+remaining+" requests, " + timeLeft + " seconds remaining)");

		if (throttleTime < 1000) {
			throw "Throttle time cannot be less than a second. We can't flood Twitter's API and get ratelimited."
		}

		setTimeout(() => {
			console.warn("Updated again");
			this.renderTweetsWrapper();
		},throttleTime)

		return this;
	}

	renderTweetsWrapper(overrideId) {
		if (window.loginOpen) {
			return;
		}

		if (!overrideId && (new Date() - this.lastUpdated < 500)) {
			throw "Safeguard hit: You can't update the column more than once every 0.5s. This error indicates that the API flood control is malfunctioning.";
		}

		this.lastUpdated = new Date();

		let func = this.renderTweets(overrideId); // Promise

		if (this.shouldCatchErrs) {
			func.catch((e) => {
				console.error(e);
				let errMsg = e.data;
				try {
					errMsg = e.data.errors[0].message;
				} catch(ee) {}
				if (!this.pauseColumnIfErrored) {
					setTimeout(() => {
						this.renderTweetsWrapper();
					},5000);
				}
				M.toast({html: errMsg});
			});
		} else {
			if (!this.pauseColumnIfErrored) {
				setTimeout(() => {
					this.renderTweetsWrapper();
				},5000);
			}
		}

		return func;
	}

	trimTweets() {
		if (this.body1.children().length > this.tweetLimit) {
			this.body1.children().each((i, tweet) => {
				if (i > this.tweetLimit) {
					tweet.remove();
				}
			})
		}
	}

    renderTweets(overrideId) {
		if (window.loginOpen) {
			return;
		}

		this.trimTweets();
        return new Promise((resolve, reject) => {
            this.updateTweets(overrideId).then((tweets) => {
				console.error("I GOT TWEETS");
				console.error(tweets)
				assert(tweets, "Column subclass didn't give Column its tweets");

				if (!tweets.sort && tweets.modules) {
					let mods = tweets.modules;
					tweets = [];
					mods.forEach(mod => {
						if (mod.status) {
							tweets.push(mod.status.data);
						} else if (!mod.user_gallery) {
							console.error("can you tell me what this means?");
							console.error(mod);
						}
					})
				}

				tweets.sort((a,b) => {
					if (Date.parse(a.created_at) > Date.parse(b.created_at)) {
						return -1;
					} else {
						return 1;
					}
				});

				if (this.body1.scrollTop() > 0) {
					tweets.forEach(tweet => this.queuedTweets.push(new Tweet(tweet, this)));
				} else {
					tweets.forEach((tweet) => {
	                    console.debug(tweet);

	                    let id = tweet.id || tweet.max_position;

						try {

		                    if (this.displayedIds[id] !== true && Filter.filterTweet(tweet, this)) {
		                        let makeTweet = new Tweet(tweet, this).element;
		                        this.displayedIds[id] = true;
		                        console.debug(makeTweet)
		                        if (this.shouldReverse || overrideId) {
									this.body1.prepend(makeTweet);
		                        } else {
									this.body1.prepend(makeTweet); //append
		                        }


		                    }
		                    if (id > this.latestId) {
		                        this.latestId = id;
		                    }
		                    if (id < this.earliestId) {
		                        this.earliestId = id;
		                    }
						} catch(e) {
							console.error("error making tweet");
							console.error(e);
						}
	                })
				}


            }).catch(e => reject(e));
        });
    }
}

exports.Column = Column;
