const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const { Interaction } = require("./Interaction.js");

class ColumnActivity extends Column {


    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Activity");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.makeMe = Interaction;
        this.icon.text("trending_up");
    }

    updateTweets() {
        return new Promise((resolve, reject) => {
            let url = "https://api.twitter.com/1.1/activity/by_friends.json?count=40"+ (this.latestId > 0 ? ("&since_id="+this.latestId) : "") +
            "&include_my_retweet=1&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1";


            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
                resolve(JSON.parse(reply));
            })
        });
    }
}

exports.ColumnActivity = ColumnActivity;
