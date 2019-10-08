const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnInteractions extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Notifications");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        // this.makeMe = Interaction;
        this.shouldReverse = true;
        this.icon.text("notifications");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/activity/about_me.json",
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

exports.ColumnInteractions = ColumnInteractions;
