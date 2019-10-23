const { TwitterAPI } = require("./TwitterAPI.js");
const { StorageAccount } = require("./StorageAccount.js");
const { Account } = require("./Account.js");

const { ColumnActivity } = require("./ColumnActivity.js");
const { ColumnCollections } = require("./ColumnCollections.js");
const { ColumnFollowers } = require("./ColumnFollowers.js");
const { ColumnHome } = require("./ColumnHome.js");
const { ColumnInteractions } = require("./ColumnInteractions.js");
const { ColumnLikes } = require("./ColumnLikes.js");
const { ColumnList } = require("./ColumnList.js");
const { ColumnMentions } = require("./ColumnMentions.js");
const { ColumnScheduled } = require("./ColumnScheduled.js");
const { ColumnSearch } = require("./ColumnSearch.js");
const { ColumnUser } = require("./ColumnUser.js");

class TweetDeckClient {

    static getTweetDeckPreferences(info) {
        return TwitterAPI.call("https://api.twitter.com/1.1/tweetdeck/clients/blackbird/all",{account:info.account})
    }

    static getContributees(info) {
        return TwitterAPI.call("https://api.twitter.com/1.1/users/contributees.json",{account:info.account})
    }

    static verifyCredentials(info) {
        return TwitterAPI.call("https://api.twitter.com/1.1/account/verify_credentials.json",{account:info.account})
    }

    static initializeTweetDeckClient(account) {

        TweetDeckClient.getTweetDeckPreferences({
            account:account
        })
        .then(prefs => TweetDeckClient.loadTweetDeckPreferences(prefs.data))
		.catch(e => {
			console.log(e);
			console.log(e.trace);
			console.log(e.message);
			console.log(Object(e));
		});

        TweetDeckClient.getContributees({account:account})
        .then(contributees => {
            console.log(contributees);
            contributees.data.forEach(acc => {
				console.log(acc.user.id_str,acc.user.id,acc.user.id_str===acc.user.id)
                if (!StorageAccount.getAccount(acc.user.id)) {
                    StorageAccount.saveAccount(new Account({
                        admin:acc.admin,
                        twitterId:acc.user.id,
                        userName:acc.user.screen_name,
                        contribId:acc.user.id_str
                    }))
                }
            })
        })
    }

    static interpretColumn(col, filters, settings) {
        let id = parseInt(col.account.userid);
        let acc = StorageAccount.getAccount(id);

        if (typeof acc === "undefined") {
            return;
        }
        var coltype;
        switch(col.type) {
            case "direct":
                // var colType = new ColumnMessages(acc, filters, settings).placeInHolder();
                // colType.renderTimer();
                break;
            case "direct":
                var colType = new ColumnCollections(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            case "home":
                var colType = new ColumnHome(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            case "interactions":
                var colType = new ColumnInteractions(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            case "list":
                // var colType = new ColumnList(acc, filters, settings).placeInHolder();
                // colType.renderTimer();
                break;
            case "mentions":
                var colType = new ColumnMentions(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            case "networkactivity":
                var colType = new ColumnActivity(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            case "search":
				var data = JSON.parse(col.metadata);
                var colType = new ColumnSearch(acc, filters || data.searchFilterData, settings, data.baseQuery).placeInHolder();
                colType.renderTimer();
                break;
            case "scheduled": // TODO: Add scheduled
                var colType = new ColumnScheduled(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            case "usertweets":
                var colType = new ColumnUser(acc, filters, settings).placeInHolder();
                colType.renderTimer();
                break;
            default:
                console.log("Unknown column type " + col.type)
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
                    TweetDeckClient.interpretColumn(feed, col.filters || {}, col.settings);
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
