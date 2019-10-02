const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ColumnLikes extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Likes");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.icon.removeClass("material-icons").addClass("icon icon-heart")
    }

    updateTweets() {
        return new Promise((resolve, reject) => {
            let url = "https://api.twitter.com/1.1/favorites/list.json?count=40"+ (this.latestId > 0 ? ("&since_id="+this.latestId) : "") +
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

exports.ColumnLikes = ColumnLikes;
