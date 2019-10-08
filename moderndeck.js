const { Column } = require("./src/Column.js");
const { TwitterAPI } = require("./src/TwitterAPI.js");
const { Account } = require("./src/Account.js");
const { StorageAccount } = require("./src/StorageAccount.js");
const { DefaultColumns } = require("./src/DefaultColumns.js");
const { TweetDeckClient } = require("./src/TweetDeckClient.js");
const { Settings } = require("./src/Settings.js");
const { UpdateTimes } = require("./src/UpdateTimes.js");
const { TweetSender } = require("./src/TweetSender.js");
const { Tweet } = require("./src/Tweet.js");
const { TwitterPollCard } = require("./src/TwitterPollCard.js");
const $ = require("jquery")

$(document).ready(() => {
    // DefaultColumns.makeDefaultColumns();

        setInterval(UpdateTimes.do, 12000);
        TweetDeckClient.getTweetDeckPreferences({account:StorageAccount.getDefaultAccount()})
                        .then(prefs => TweetDeckClient.loadTweetDeckPreferences(prefs.data))

})
