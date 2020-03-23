const { make, div, assert } = require("./src/Helpers.js");
const { ComposeController } = require("./src/ComposeController.js");
const { DefaultColumns } = require("./src/DefaultColumns.js");
const { LinkDelegation } = require("./src/LinkDelegation.js");
const { StorageAccount } = require("./src/StorageAccount.js");
const { TweetDeckClient } = require("./src/TweetDeckClient.js");
const { Tweet } = require("./src/Tweet.js");
const { Media } = require("./src/Media.js");
const { TwitterAPI } = require("./src/TwitterAPI.js");
const { UpdateTimes } = require("./src/UpdateTimes.js");
const {DataTweet} = require("./src/DataTweet.js");
const {DataUser} = require("./src/DataUser.js");
const $ = require("jquery");
const jquery = require("jquery");

window.mode = "deck";
window.loginOpen = false;

const { ModalRetweet } = require("./src/ModalRetweet.js");

$(document).ready(() => {
    // DefaultColumns.makeDefaultColumns();

	$(alphaversion).html("Version 10.0.0.2020.03.23")

		window.Modals = [];
		window.Dropdowns = [];
		window.TweetCache = [];
		window.UserCache = [];
		window.Tweets = [];
		window.TweetsByUser = [];

		window.body = $(document.body);
		window.head = $(document.head);


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
				(window.Dropdowns.pop()).dismiss();
			}
		})

        setInterval(UpdateTimes.do, 12000);

        let account = StorageAccount.getDefaultAccount();

        TweetDeckClient.initializeTweetDeckClient(account);

		window.composeController = new ComposeController();

        LinkDelegation.attach();
})
