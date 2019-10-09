const { TwitterAPI } = require("./TwitterAPI.js");
const { buildApiUrl } = require("./Helpers.js");

class TweetSender {
    static send(tweet) {
        return new Promise((resolve, reject) => {
            TwitterAPI.call(
                "https://api.twitter.com/1.1/statuses/update.json",
                {account:tweet.account, method:"POST", postData:"status=" + tweet.text + ""}
            ).then((reply) => {
				try {
					resolve(JSON.parse(reply));
				} catch(e) {
					resolve(reply);
				}

            }).catch(e => reject(e));
        });
    }
}

exports.TweetSender = TweetSender;
