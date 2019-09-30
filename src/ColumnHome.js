const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ColumnHome extends Column {

    constructor(user) {
        super(user);
        this.columnTitle.html("Home");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
    }

    updateTweets() {

        return new Promise((resolve, reject) => {
            TwitterAPI.call(
                "https://api.twitter.com/1.1/statuses/home_timeline.json?count=40&include_my_retweet=1&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&tweet_mode=extended&include_ext_alt_text=true&include_reply_count=true",
                {account:this.account, method:"GET"}
            ).then((reply) => {
                resolve(JSON.parse(reply));
            })
        });
    }
}

exports.ColumnHome = ColumnHome;
