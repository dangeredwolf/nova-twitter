const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ColumnSearch extends Column {

    query;

    constructor(user, query) {
        super(user);
        this.columnTitle.html(query);
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.query = query;
    }

    updateTweets() {
        return new Promise((resolve, reject) => {
            let url = "https://api.twitter.com/1.1/search/universal.json?count=40"+ (this.latestId > 0 ? ("&since_id="+this.latestId) : "") +
            "&q="+encodeURIComponent(this.query)+"&include_my_retweet=1&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1";


            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
                resolve(JSON.parse(reply));
            })
        });
    }
}

exports.ColumnSearch = ColumnSearch;
