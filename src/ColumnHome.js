const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnHome extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Home");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.icon.text("home");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/statuses/home_timeline.json",
                    id:(overrideId || this.latestId),
                    loadBackwards: !!overrideId
                }
            );
            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
                resolve(reply.data);
            }).catch(e => reject(e))
        });
    }
}

exports.ColumnHome = ColumnHome;
