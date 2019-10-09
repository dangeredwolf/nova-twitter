const { Account } = require("./src/Account.js");
const { Column } = require("./src/Column.js");
const { ComposeController } = require("./src/ComposeController.js");
const { DefaultColumns } = require("./src/DefaultColumns.js");
const { StorageAccount } = require("./src/StorageAccount.js");
const { Settings } = require("./src/Settings.js");
const { TweetDeckClient } = require("./src/TweetDeckClient.js");
const { TweetSender } = require("./src/TweetSender.js");
const { Tweet } = require("./src/Tweet.js");
const { TwitterAPI } = require("./src/TwitterAPI.js");
const { TwitterPollCard } = require("./src/TwitterPollCard.js");
const { UpdateTimes } = require("./src/UpdateTimes.js");
const $ = require("jquery")

$(document).ready(() => {
    // DefaultColumns.makeDefaultColumns();

        setInterval(UpdateTimes.do, 12000);
        TweetDeckClient.getTweetDeckPreferences({account:StorageAccount.getDefaultAccount()})
                        .then(prefs => TweetDeckClient.loadTweetDeckPreferences(prefs.data))

		window.composeController = new ComposeController();
})
