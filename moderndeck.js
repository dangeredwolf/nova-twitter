const { Account } = require("./src/Account.js");
const { Column } = require("./src/Column.js");
const { ComposeController } = require("./src/ComposeController.js");
const { DefaultColumns } = require("./src/DefaultColumns.js");
const { LinkDelegation } = require("./src/LinkDelegation.js");
const { StorageAccount } = require("./src/StorageAccount.js");
const { Settings } = require("./src/Settings.js");
const { TweetDeckClient } = require("./src/TweetDeckClient.js");
const { TweetSender } = require("./src/TweetSender.js");
const { Tweet } = require("./src/Tweet.js");
const { TwitterAPI } = require("./src/TwitterAPI.js");
const { TwitterPollCard } = require("./src/TwitterPollCard.js");
const { UpdateTimes } = require("./src/UpdateTimes.js");
const $ = require("jquery");

const { ModalRetweet } = require("./src/ModalRetweet.js");

$(document).ready(() => {
    // DefaultColumns.makeDefaultColumns();

		window.Modals = [];
		window.Dropdowns = [];

		$(".mdl-container").click(() => {
			window.Modals.forEach((a, i) => {
				if (typeof a !== "undefined") {
					a.dismiss();
					window.Modals[i] = undefined;
				}
			})
		})

		$(document).click(() => {
			while (window.Dropdowns.length > 0) {
				window.Dropdowns.pop().dismiss();
			}
		})

        setInterval(UpdateTimes.do, 12000);

        let account = StorageAccount.getDefaultAccount();

        TweetDeckClient.initializeTweetDeckClient(account);

		window.composeController = new ComposeController();

        LinkDelegation.attach();
})
