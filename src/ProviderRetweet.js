const { TwitterAPI } = require("./TwitterAPI.js");


class ProviderRetweet {
	static retweet(tweet, account) {
		return new Promise((resolve, reject) => {
			TwitterAPI.call("https://api.twitter.com/1.1/statuses/retweet/" + tweet.id_str + ".json",{
				account:account,
				method:"POST",
				postData:"cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended&include_ext_alt_text=true&include_reply_count=true"
			}).catch(e => {
				// console.log(e);
				let errMsg = e;
				try {
					errMsg = e.errors[0].message;
				} catch(ee) {}
				M.toast({html: errMsg});
				reject(e);
			}).then(e => resolve(e))
		})

	}

	static unRetweet(tweet, account) {
		return new Promise((resolve, reject) => {
			TwitterAPI.call("https://api.twitter.com/1.1/statuses/destroy/" + tweet.id_str + ".json", {
				account:account,
				method:"POST",
				postData:"cards_platform=Web-13&include_entities=1&include_user_entities=1&include_cards=1&send_error_codes=1&tweet_mode=extended&include_ext_alt_text=true&include_reply_count=true"
			}).catch(e => {
				// console.log(e);
				let errMsg = e;
				try {
					errMsg = e.errors[0].message;
				} catch(ee) {}
				M.toast({html: errMsg});
				reject(e);
			}).then(e => resolve(e))
		})

	}
}

exports.ProviderRetweet = ProviderRetweet;
