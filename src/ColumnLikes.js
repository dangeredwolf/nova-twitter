const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnLikes extends Column {

    constructor(user, filters, settings) {
        super(user, filters, settings);
        this.columnTitle.html("Likes");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.icon.removeClass("material-icons").addClass("icon icon-heart")
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/favorites/list.json",
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

exports.ColumnLikes = ColumnLikes;
