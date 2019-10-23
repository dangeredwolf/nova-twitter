const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnActivity extends Column {


    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Activity");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.icon.text("trending_up");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/activity/by_friends.json",
                    id:(overrideId || this.latestId),
                    loadBackwards: !!overrideId
                }
            );
            TwitterAPI.call(
                url,
                {account:this.account, method:"GET"}
            ).then((reply) => {
				this.apiThrottleHook(reply.headers);
                resolve(reply.data);
            }).catch(e => reject(e))
        });
    }
}

exports.ColumnActivity = ColumnActivity;
