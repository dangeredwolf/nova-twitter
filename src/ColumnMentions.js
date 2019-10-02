const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnMentions extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Mentions");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.icon.text("message");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/statuses/mentions_timeline.json",
                    id:(overrideId || this.latestId),
                    loadBackwards: !!overrideId
                }
            );
            
            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
                resolve(JSON.parse(reply));
            }).catch(e => reject(e))
        });
    }
}

exports.ColumnMentions = ColumnMentions;
