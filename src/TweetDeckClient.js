const { TwitterAPI } = require("./TwitterAPI.js");
const { StorageAccount } = require("./StorageAccount.js");

const { ColumnHome } = require("./ColumnHome.js");
const { ColumnInteractions } = require("./ColumnInteractions.js");

class TweetDeckClient {

    static getTweetDeckPreferences(info) {
        return TwitterAPI.call("https://api.twitter.com/1.1/tweetdeck/clients/blackbird/all",{account:info.account})
    }

    static interpretColumn(col) {
        let id = parseInt(col.account.userid);
        let acc = StorageAccount.getAccount(id);

        if (typeof acc === "undefined") {
            return;
        }
        switch(col.type) {
            case "home":
                let home = new ColumnHome(acc).placeInHolder();
                home.renderTimer();
                break;
            case "interactions":
                let interact = new ColumnInteractions(acc).placeInHolder();
                interact.renderTimer();
                break;
        }
    }

    static loadTweetDeckPreferences(prefs) {
        prefs.client.columns.forEach((column) => {
            let col = prefs.columns[column];

            if (col.type === "other") {
                if (col.feeds.length >= 1) {
                    if (col.feeds.length > 1)
                        console.log("Multi-feed is not yet implemented");

                    let feed = prefs.feeds[col.feeds[0]];
                    TweetDeckClient.interpretColumn(feed);
                } else {
                    console.log("Oh, interesting, it's both not an 'other' column and doesn't have any feeds")
                }
            } else {
                console.log("Trends, etc not yet implemented")
            }
        })
    }
}

exports.TweetDeckClient = TweetDeckClient;
