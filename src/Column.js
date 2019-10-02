const $ = require("jquery");
const { div, make } = require("./Helpers.js");
const { ColumnHolder } = require("./ColumnHolder.js");
const { Tweet } = require("./Tweet.js");
const { Filter } = require("./Filter.js");

class Column {

    element;
    headElement;
    icon;
    columnTitle;
    columnUsername;
    body;
    account;
    makeMe = Tweet;

    displayedIds = {};
    latestId = 0;
    earliestId = 99999999999999999999;
    shouldReverse = false;
    isLoadingMore = false;

    filters = {};
    settings = {}


    constructor(user, filters, settings) {
        this.element = div("column");
        this.columnTitle = div("column-title");
        this.columnUsername = div("column-username txt-mute");
        this.icon = make("i").addClass("material-icons");
        this.headElement = div("column-header").append(this.icon,this.columnTitle, this.columnUsername);
        this.body = div("column-body");
        this.element.append(this.headElement, this.body);
        this.filters = filters;
        this.settings = settings;

        this.body.scroll(() => {
            if ($(this.body).scrollTop() + $(this.body).height() > $(this.body).prop("scrollHeight") - 200) {
    			if (!this.isLoadingMore) {
                    console.log("im actually screaming")
                    this.isLoadingMore = true;

                    this.renderTweets(this.earliestId).catch(e => {
                        let errMsg = e;
                        try {
                            errMsg = JSON.parse(e).errors[0].message;
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
            this.renderTweets().catch(e => {
                let errMsg = e;
                try {
                    errMsg = JSON.parse(e).errors[0].message;
                } catch(ee) {}
                M.toast({html: errMsg})
            })
        }, 6500);
        setTimeout(() => {
            this.renderTweets().catch(e => {
                let errMsg = e;
                try {
                    errMsg = JSON.parse(e).errors[0].message;
                } catch(ee) {}
                M.toast({html: errMsg})
            })
        }, 0);
    }

    renderTweets(overrideId) {
        return new Promise((resolve, reject) => {
            this.updateTweets(overrideId).then((tweets) => {

                tweets.forEach((tweet) => {
                    console.log(tweet);

                    let id = tweet.id || tweet.max_position;

                    if (this.displayedIds[id] !== true && Filter.filterTweet(tweet, this)) {
                        let makeTweet = new this.makeMe(tweet).element;
                        this.displayedIds[id] = true;
                        console.log(makeTweet)
                        if (this.shouldReverse || overrideId) {
                            this.body.append(makeTweet);
                        } else {
                            this.body.prepend(makeTweet);
                        }


                    }
                    if (id > this.latestId) {
                        this.latestId = id;
                    }
                    if (id < this.earliestId) {
                        this.earliestId = id;
                    }
                })
            }).catch(e => reject(e));
        })
    }
}

exports.Column = Column;
