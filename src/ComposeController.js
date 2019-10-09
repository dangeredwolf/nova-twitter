const $ = require("jquery");
const {TweetSender} = require("./TweetSender.js");
const {MediaUpload} = require("./MediaUpload.js");
const {StorageAccount} = require("./StorageAccount.js");

class ComposeController {
	tweetCharacterLimit = 280;

	selectedAccount = StorageAccount.getDefaultAccount();

	buttonAddImage = $(".compose-add-image-button");;
	buttonAddGif = $(".compose-add-gif-button");
	// buttonAddPoll = $(".compose-add-poll-button");
	buttonSchedule = $(".compose-schedule-button");
	buttonSend = $(".compose-send-button");
	composeText = $(".compose-text");
	characterCount = $(".composer-char-display");
	characterStroke = $(".character-char-stroke");
	element = $(".compose");

	constructor() {
		this.composeText.on("input keyup paste", ()=>this.updateCharCount(this));
		this.buttonSend.click(this.sendTweet);
		this.buttonAddImage.click(this.addImagePanel);
	}

	updateCharCount() {

		let text = composeController.composeText.val();
		let charsRemaining = composeController.tweetCharacterLimit - text.length;
		let dashOffset = Math.max(50.2655 * (charsRemaining / composeController.tweetCharacterLimit), 0);

		composeController.characterStroke.attr("style",`stroke-dasharray:50.2655; stroke-dashoffset:${dashOffset}`)

	}

	addImagePanel() {
		
	}

	sendTweet() {
		M.toast({html: "Sending tweet..."});

		TweetSender.send({account:composeController.selectedAccount,text:composeController.composeText.val()}).then(() => {
			M.toast({html: "Tweet sent!"});
		}).catch(e => {
			M.toast({html: "Error sending tweet: " + e.message});
		})

	}
}

exports.ComposeController = ComposeController;
