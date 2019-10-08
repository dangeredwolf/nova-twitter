// https://twitter.com/i/cards/create/v1
const { TwitterAPI } = require("./TwitterAPI.js");
const { TwitterCard } = require("./TwitterCard.js");

class TwitterPollCard extends TwitterCard {
	data;
	account;

	constructor(data) {
		super();
		let newData = {};
		newData["twitter:card"] = "poll" + data.choices + "choice_text_only";
		newData["twitter:api:api:endpoint"] = "1";
		data.choices.forEach((e,i) => {
			newData["twitter:string:choice" + i + "_label"] = e;
		});
		newData["twitter:long:duration_minutes"] = data.durationMinutes;

		this.data = newData;

		this.account = data.account;

		return this;
	}

	make() {
		return new Promise((resolve, reject) => {
			let postData = "authenticity_token=" + this.account.authToken + "&card_data=" + encodeURIComponent(JSON.stringify(this.data));
			console.log(postData);
	    	TwitterAPI.call(
	            "https://twitter.com/i/cards/create/v1",
	            {account:this.account, method:"POST", postData:postData}
	        ).then((reply) => {
	            resolve(JSON.parse(reply));
	        }).catch(e => reject(e));
	    });
	}
}

exports.TwitterPollCard = TwitterPollCard;

//card_uri: card://1181686977323819008
