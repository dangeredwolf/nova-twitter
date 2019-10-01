const {make, div, timeAgo} = require("./Helpers.js");

class Tweet {
    element;
    tweetHead;
    tweetLink;
    retweetLink;
    tweetDisplayName;
    tweetUsername;
    tweetProfilePic;
    retweetDisplayName;
    retweetUsername;
    retweetProfilePic;
    tweetText;
    tweetBody;
    tweetTime;
    attribution;

    constructor(data) {
        this.tweetDisplayName = div("tweet-display-name").text(data.user.name);

        if (typeof data.retweeted_status === "undefined") {
            this.tweetUsername = div("tweet-username").text(data.user.screen_name);
            this.tweetProfilePic = make("img").attr("src", data.user.profile_image_url_https).addClass("tweet-profile-pic");
        }

        this.tweetLink = make("a").attr("href","https://twitter.com/" + data.user.screen_name).attr("target","_blank")
                        .append(this.tweetProfilePic, this.tweetDisplayName, this.tweetUsername);

        this.tweetHead = div("tweet-header").append(this.tweetLink);

        if (typeof data.retweeted_status !== "undefined") {
            this.attribution = div("tweet-attribution").append(this.tweetLink);
            this.retweetDisplayName = div("tweet-display-name retweet-display-name").text(data.retweeted_status.user.name);
            this.retweetUsername = div("tweet-username retweet-username").text(data.retweeted_status.user.screen_name);
            this.retweetProfilePic = make("img").attr("src", data.retweeted_status.user.profile_image_url_https).addClass("tweet-profile-pic retweet-profile-pic");
            this.retweetLink = make("a").attr("href","https://twitter.com/" + data.retweeted_status.user.screen_name).attr("target","_blank")
                            .append(this.retweetProfilePic, this.retweetDisplayName, this.retweetUsername);
            this.tweetHead.append(this.attribution, this.retweetLink);
        }

        this.tweetText = div("tweet-text").text(data.full_text || data.text);
        this.tweetTime = div("tweet-time").text(timeAgo(data.created_at));

        this.tweetBody = div("tweet-body").append(this.tweetText, this.tweetTime);

        this.element = make("article").addClass("tweet").attr("data-id", data.id).append(this.tweetHead, this.tweetBody);

        return this;
    }
}

exports.Tweet = Tweet;
