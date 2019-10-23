const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnSearch extends Column {

    query;

    constructor(user, filters, settings, query) {
        super(user, filters, settings);
        this.columnTitle.html(query);
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.query = query;
        this.icon.text("search");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/search/universal.json",
                    id:(overrideId || this.latestId),
                    loadBackwards: !!overrideId,
                    parameters:"&q="+encodeURIComponent(this.query)
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

exports.ColumnSearch = ColumnSearch;
