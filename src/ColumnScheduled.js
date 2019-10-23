const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnFollowers extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Scheduled");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.shouldReverse = true;
        this.icon.text("schedule");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/schedule/status/list.json",
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

exports.ColumnFollowers = ColumnFollowers;
