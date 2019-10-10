const $ = require("jquery");
const { make, div, assert } = require("./Helpers.js");
const { Modal } = require("./Modal.js");
const { Tweet } = require("./Tweet.js");

class ModalRetweet extends Modal {

	buttonRetweet;
	buttonQuote;

	constructor(parameters) {
		super(parameters);

		assert(parameters.tweet, "tweet not specified for ModalRetweet");

		this.element.addClass("mdl-retweet");
		this.title.html("Retweet from...");

		let newData = parameters.tweet.data;
		newData.disableActionButtons = true;
		newData.column = null;

		this.buttonRetweet = make("a").addClass("btn-retweet mdl-retweet-btn waves-effect waves-light btn").append(
			make("i").addClass("icon icon-retweet"),
			"Retweet"
		);

		this.buttonQuote = make("a").addClass("btn-quote-tweet mdl-retweet-btn waves-effect waves-dark btn-flat").append(
			make("i").addClass("icon icon-quote-tweet"),
			"Quote"
		);

		this.body.append(
			div("mdl-retweet-account-selector"),
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
