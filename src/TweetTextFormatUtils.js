class TweetTextFormatUtils {
	static format(text) {
		if (typeof text !== "string") {
			debugger;
			throw new TypeError("TweetTextFormatUtils.format expected argument of string, got " + typeof text)
		}
		text = text.replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\"/g,"&quot;").replace(/\n/g,"<br>");
		return text
	}
}

exports.TweetTextFormatUtils = TweetTextFormatUtils;
