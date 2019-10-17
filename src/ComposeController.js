const $ = require("jquery");
const {TweetSender} = require("./TweetSender.js");
const {Tweet} = require("./Tweet.js");
const {MediaUpload} = require("./MediaUpload.js");
const {StorageAccount} = require("./StorageAccount.js");
const {AccountSelector} = require("./AccountSelector.js");
const {make,assert} = require("./Helpers.js");
const fs = require("fs");
const fsPromises = fs.promises;

class ComposeController {
	tweetCharacterLimit = 280;

	selectedAccount = StorageAccount.getDefaultAccount();

	accountSelector;
	buttonAddImage = $(".compose-add-image-button");
	buttonAddGif = $(".compose-add-gif-button");
	// buttonAddPoll = $(".compose-add-poll-button");
	buttonSchedule = $(".compose-schedule-button");
	buttonSend = $(".compose-send-button");
	composeText = $(".compose-text");
	characterCount = $(".compose-char-display");
	characterStroke = $(".character-char-stroke");
	composeReplyTo = $(".compose-reply-to");
	element = $(".compose");
	internal_replyTo = null;

	constructor() {
		this.composeText.on("input keyup paste", ()=>this.updateCharCount(this));
		this.buttonSend.click(this.sendTweet);
		this.buttonAddImage.click(this.addImagePanel);

		this.accountSelector = new AccountSelector(true);
		console.log(this.accountSelector);
	}

	get replyTo() {
		return this.internal_replyTo;
	}

	set replyTo(tweet) {
		assert(tweet, "Expected argument 1, tweet, typeof object, got " + typeof tweet);
		tweet.composeAttachment = true;
		composeController.internal_replyTo = tweet;
		composeController.composeReplyTo.removeClass("hidden").children().remove()
		composeController.composeReplyTo.append(
			new Tweet(tweet).element.append(
				make("a").attr("href","#").addClass("compose-reply-to-remove").append(
					make("i").addClass("material-icons").html("close")
				).click(() => {
					$(".compose-reply-to .tweet").remove();
					composeController.composeReplyTo.html("")
					composeController.internal_replyTo = null;
				})
			)

		)
	}

	updateCharCount() {

		let text = composeController.composeText.val();
		let charsRemaining = composeController.tweetCharacterLimit - text.length;
		let dashOffset = Math.max(50.2655 * (charsRemaining / composeController.tweetCharacterLimit), 0);

		composeController.characterStroke.attr("style",`stroke-dasharray:50.2655; stroke-dashoffset:${dashOffset}`)

	}

	addImagePanel() {
		composeController.fileSelectDialog().then((res) => {
			console.log(res);
			if (!res.canceled) { // if it's canceled then just forget it
				res.filePaths.forEach(path => {
					console.log(path);
					fsPromises.open(path, "r").then(handle => {
						handle.readFile({encoding:"utf8"}).then(fileCont => {
							console.log(fileCont);
							console.log("Above are the file contents");
							MediaUpload.initUpload({account:(composeController.accountSelector.selectedAccount),blob:fileCont,mediaType:"image/jpeg"}).then(ree => {
								console.log("Success bitches");
								console.log(ree)
							})
						})
					})
				})
			}
		})
	}

	fileSelectDialog() {
		const { dialog } = require('electron').remote;
		console.log(dialog);

		return new Promise((resolve, reject) => {
			dialog.showOpenDialog({
				title:"Select an image or video...",
				buttonLabel:"Attach media",
				properties:["openFile", "multiSelections"]
			}).then(a => {
				resolve(a);
			}).catch(e => {
				reject(e);
			})

		})
	}

	sendTweet() {
		M.toast({html: "Sending tweet..."});

		composeController.send({account:(composeController.accountSelector.selectedAccount),text:composeController.composeText.val()}).then(() => {
			M.toast({html: "Tweet sent!"});
		}).catch(e => {
			M.toast({html: "Error sending tweet: " + e.message});
		})

	}

	send(tweet) {
		return new Promise((resolve, reject) => {
			let statusData = "status=" + tweet.text;

			if (composeController.internal_replyTo !== null) {
				statusData += ("&in_reply_to_status_id=" + composeController.internal_replyTo.id_str);
			}

			statusData += "&auto_populate_reply_metadata=true&batch_mode=off&exclude_reply_user_ids=&cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended&include_ext_alt_text=true&include_reply_count=true";
			TwitterAPI.call(
				"https://api.twitter.com/1.1/statuses/update.json",
				{account:tweet.account, method:"POST", postData: statusData}
			).then((reply) => {
				try {
					resolve(JSON.parse(reply));
				} catch(e) {
					resolve(reply);
				}
				composeController.teardownComposer();

			}).catch(e => reject(e));
		});
	}

	teardownComposer() {

		composeController.composeReplyTo.children().remove();
		composeController.composeReplyTo.html("");
		composeController.composeText.val("");
	}
}

exports.ComposeController = ComposeController;
