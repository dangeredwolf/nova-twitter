const $ = require("jquery");
const { make, div, assert } = require("./Helpers.js");
const { Modal } = require("./Modal.js");
const { Tweet } = require("./Tweet.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ModalMedia extends Modal {

	constructor(parameters) {
		super(parameters);

		assert(parameters.tweet, "tweet not specified for ModalMedia");

		this.element.addClass("mdl-media");
		this.title.remove();


		this.body.append(
			this.accountSelector.element,
			new Tweet(newData).element
		);

		return this;
	}

	beforeDisplay() {

	}

	afterDisplay() {
		console.log("Display is done!");
	}
}

exports.ModalMedia = ModalMedia;
