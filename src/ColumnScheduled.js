const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const { Interaction } = require("./Interaction.js");

class ColumnFollowers extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Scheduled");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.shouldReverse = true;
        this.icon.text("schedule");
    }

    updateTweets() {
        return new Promise((resolve, reject) => {
            let url = "https://api.twitter.com/1.1/schedule/status/list.json?count=40&skip_aggregation=true"+ (this.latestId > 0 ? ("&since_id="+this.latestId) : "") +
            "&include_my_retweet=1&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&tweet_mode=extended&include_reply_count=true&include_ext_alt_text=true";


            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
                console.log(JSON.parse(reply));
                resolve(JSON.parse(reply));
            })
        });
    }
}

exports.ColumnFollowers = ColumnFollowers;
