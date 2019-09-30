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

    displayedIds = {};
    latestId = 0;


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
        }, 2500);
    }

    renderTweets() {
        return new Promise((resolve, reject) => {
            this.updateTweets().then((tweets) => {
                tweets.forEach((tweet) => {
                    // console.log(tweet);

                    if (this.displayedIds[tweet.id] !== true) {
                        let makeTweet = new Tweet(tweet).element;
                        this.displayedIds[tweet.id] = true;

                        if (this.latestId !== 0) {
                            this.body.prepend(makeTweet);
                        } else {
                            this.body.append(makeTweet);
                        }
                    }
                    if (tweet.id > this.latestId) {
                        this.latestId = tweet.id;
                    }
                })
            });
        })
    }
}

exports.Column = Column;
