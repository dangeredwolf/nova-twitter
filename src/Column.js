const $ = require("jquery");
const { div } = require("./Helpers.js");
const { ColumnHolder } = require("./ColumnHolder.js");
const { Tweet } = require("./Tweet.js");

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
    shouldReverse = false;


    constructor() {
        this.element = div("column");
        this.columnTitle = div("column-title");
        this.columnUsername = div("column-username");
        this.headElement = div("column-header").append(this.columnTitle, this.columnUsername);
        this.body = div("column-body");
        this.element.append(this.headElement, this.body);
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
            this.renderTweets()
        }, 6500);
    }

    renderTweets() {
        return new Promise((resolve, reject) => {
            this.updateTweets().then((tweets) => {
                if (this.shouldReverse) {
                    tweets = tweets.reverse();
                }
                tweets.forEach((tweet) => {
                    console.log(tweet);

                    let id = tweet.id || tweet.max_position;

                    if (this.displayedIds[id] !== true) {
                        let makeTweet = new this.makeMe(tweet).element;
                        this.displayedIds[id] = true;
                        console.log(makeTweet)
                        this.body.prepend(makeTweet);

                    }
                    if (id > this.latestId) {
                        this.latestId = id;
                    }
                })
            });
        })
    }
}

exports.Column = Column;
