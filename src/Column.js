const $ = require("jquery");
const { div, make } = require("./Helpers.js");
const { ColumnHolder } = require("./ColumnHolder.js");
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

    filters = {};
    settings = {};
	queuedTweets = [];
	tweetLimit = 100;


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
        this.filters = filters;
        this.settings = settings;

		for (let setting in this.settings) {
			if (setting === "media_preview_size") {
				this.element.addClass("column-settings-media_preview_size-" +  this.settings[setting])
			}
		}

        this.body1.scroll(() => {
            if ($(this.body1).scrollTop() + $(this.body1).height() > $(this.body1).prop("scrollHeight") - 200) {
    			if (!this.isLoadingMore) {
                    console.log("im actually screaming")
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
       		}
        })

        return this;
    }

    placeInHolder() {
        console.log("placeInHolder");
        $(".column-holder").append(this.element);
        return this;
    }

    updateTweets() {
        // base Column class doesn't have update logic
        return this;
    }

    renderTimer() {
        setInterval(() => {
            this.renderTweetsWrapper();
        }, 10000);
        setTimeout(() => {
            this.renderTweetsWrapper();
        }, 0);
    }

	renderTweetsWrapper(overrideId) {
		let func = this.renderTweets(overrideId); // Promise

		if (this.shouldCatchErrs) {
			func.catch(e => {
				let errMsg = e.data;
				try {
					errMsg = e.data.errors[0].message;
				} catch(ee) {}
				M.toast({html: errMsg})
			});
		}

		return func;
	}

	trimTweets() {
		if (this.body1.children().length > tweetLimit) {
			this.body1.children().each((i, tweet) => {
				if (i > tweetLimit) {
					tweet.remove();
				}
			})
		}
	}

    renderTweets(overrideId) {
        return new Promise((resolve, reject) => {
            this.updateTweets(overrideId).then((tweets) => {

				if (this.body1.scrollTop() > 0) {
					tweets.forEach(tweet => this.queuedTweets.push(tweet));
				} else {
					tweets.forEach((tweet) => {
	                    console.log(tweet);

	                    let id = tweet.id || tweet.max_position;

	                    if (this.displayedIds[id] !== true && Filter.filterTweet(tweet, this)) {
	                        let makeTweet = new Tweet(tweet, this).element;
	                        this.displayedIds[id] = true;
	                        console.log(makeTweet)
	                        if (this.shouldReverse || overrideId) {
	                            this.body1.append(makeTweet);
	                        } else {
	                            this.body1.prepend(makeTweet);
	                        }


	                    }
	                    if (id > this.latestId) {
	                        this.latestId = id;
	                    }
	                    if (id < this.earliestId) {
	                        this.earliestId = id;
	                    }
	                })
				}


            }).catch(e => reject(e));
        });
		this.trimTweets();
    }
}

exports.Column = Column;
