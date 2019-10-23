const $ = require("jquery");
const { make, div, assert } = require("./Helpers.js");
const { Modal } = require("./Modal.js");
const { TwitterAPI } = require("./TwitterAPI.js");

class ModalMedia extends Modal {

	tweet;
	entries = [];
	view;
	container;

	constructor(parameters) {
		super(parameters);

		assert(parameters.tweet, "tweet not specified for ModalMedia");

		this.element.addClass("mdl-media");
		this.title.remove();

		this.selected = parameters.defaultSelected || 0;

		console.log(Tweet);

		this.view = div("mdl-media-view").attr("data-selected", this.selected);

		if (parameters.tweet) {
			this.tweet = parameters.tweet;
			this.tweet.sourceTweet.extended_entities.media.forEach(media => {
				if (!media.video_info) {
					this.view.append(
						new Media(media.media_url_https,{display_url:media.expanded_url,tweet:this.tweet}).element
					)
				} else {

					let url = Media.getBestMediaVariant(media.video_info.variants);

					this.view.append(
						new Media(media.media_url_https,{type:"video",tweet:this.tweet}).element
					)
				}
			});

			if (this.tweet.sourceTweet.extended_entities.media.length > 1) {
				this.view.addClass("mdl-multi-media-view")
			}
		}

		this.container = div("mdl-media-container").append(
			make("button").append(make("i").addClass("icon material-icons").html("back")).addClass("mdl-media-control mdl-media-control-left"),
			this.view,
			make("button").append(make("i").addClass("icon material-icons").html("forward")).addClass("mdl-media-control mdl-media-control-right")
		)

		this.body.append(
			this.view,
			new Tweet(parameters.tweet).element
		);

		this.display();

		return this;
	}

	beforeDisplay() {

	}

	afterDisplay() {
		console.log("Display is done!");
	}
}

exports.ModalMedia = ModalMedia;
