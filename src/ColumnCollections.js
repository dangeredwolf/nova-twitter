const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

class ColumnCollections extends Column {

    listId;

    constructor(user, filters, settings, listId) {
        super(user, filters, settings);
        this.columnTitle.html("Collections");
        this.columnUsername.html("@" + (user.userName || ""));
        this.account = user;
        this.listId = listId;
        this.icon.text("collections_bookmark");
    }

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/lists/statuses.json",
                    id:(overrideId || this.latestId),
                    loadBackwards: !!overrideId,
                    parameters:"&list_id="+this.listId
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

exports.ColumnCollections = ColumnCollections;
