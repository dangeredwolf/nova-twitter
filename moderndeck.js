const { Column } = require("./src/Column.js");
const { ColumnHome } = require("./src/ColumnHome.js");
const { TwitterAPI } = require("./src/TwitterAPI.js");
const { Account } = require("./src/Account.js");
const { StorageAccount } = require("./src/StorageAccount.js");
const { DefaultColumns } = require("./src/DefaultColumns.js");
const { TweetDeckClient } = require("./src/TweetDeckClient.js");
const { Settings } = require("./src/Settings.js");
const $ = require("jquery")

$(document).ready(() => {
    // DefaultColumns.makeDefaultColumns();

        TweetDeckClient.getTweetDeckPreferences({account:StorageAccount.getDefaultAccount()}).then(prefs => TweetDeckClient.loadTweetDeckPreferences(JSON.parse(prefs)))

})
