const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ColumnList extends Column {

    listId;
    listTitle;

    constructor(user, filters, settings, listId, listTitle) {
        super(user, filters, settings);
        this.columnTitle.html(listTitle);
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.listId = listId;
        this.listTitle = listTitle;
        this.icon.text("format_list_bulleted");
    }

    updateTweets() {
        return new Promise((resolve, reject) => {
            let url = "https://api.twitter.com/1.1/lists/statuses.json?count=40"+ (this.latestId > 0 ? ("&since_id="+this.latestId) : "") +
            "&list_id="+this.listId+"&include_my_retweet=1&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1";


            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
                resolve(JSON.parse(reply));
            })
        });
    }
}

exports.ColumnList = ColumnList;
