const $ = require("jquery");
const { make, div, assert } = require("./Helpers.js");
const { Modal } = require("./Modal.js");
const { Tweet } = require("./Tweet.js");
const { AccountSelector } = require("./AccountSelector.js");
const { ProviderRetweet } = require("./ProviderRetweet.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ModalRetweet extends Modal {

	buttonRetweet;
	buttonQuote;
	accountSelector;

	constructor(parameters) {
		super(parameters);

		assert(parameters.tweet, "tweet not specified for ModalRetweet");

		this.element.addClass("mdl-retweet");
		this.title.html("Retweet from...");
		this.accountSelector = new AccountSelector();

		let newData = parameters.tweet.data;
		newData.disableActionButtons = true;
		newData.column = null;

		this.buttonRetweet = make("a").addClass("btn-retweet mdl-retweet-btn waves-effect waves-light btn").append(
			make("i").addClass("icon icon-retweet"),
			"Retweet"
		).click(() => {
			let acc = this.accountSelector.selectedAccount;
			ProviderRetweet.retweet(parameters.tweet.sourceTweet, acc);
			this.dismiss();
		})

		this.buttonQuote = make("a").addClass("btn-quote-tweet mdl-retweet-btn waves-effect waves-dark btn-flat").append(
			make("i").addClass("icon icon-quote-tweet"),
			"Quote"
		);

		this.body.append(
			this.accountSelector.element,
			new Tweet(newData).element
		);

		this.footer.append(
			this.buttonRetweet,
			this.buttonQuote
		)

		return this;
	}

	beforeDisplay() {

	}

	afterDisplay() {
		console.log("Display is done!");
	}
}

exports.ModalRetweet = ModalRetweet;
