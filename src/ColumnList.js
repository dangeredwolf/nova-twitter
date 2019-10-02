const {Column} = require("./Column.js");
const { TwitterAPI } = require("./TwitterAPI.js");
const {buildApiUrl} = require("./Helpers.js");

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

    updateTweets(overrideId) {
        return new Promise((resolve, reject) => {
            let url = buildApiUrl(
                {
                    endpoint:"/lists/statuses.json",
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

exports.ColumnList = ColumnList;
