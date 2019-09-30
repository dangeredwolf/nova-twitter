const {make, div} = require("./Helpers.js");

class Tweet {
    element;
    tweetHead;
    tweetLink;
    tweetDisplayName;
    tweetUsername;
    tweetProfilePic;
    tweetText;
    tweetBody;
    tweetTime;

    constructor(data) {
        this.tweetDisplayName = div("tweet-display-name").text(data.user.name);
        this.tweetUsername = div("tweet-username").text(data.user.screen_name);
        this.tweetProfilePic = make("img").attr("src", data.user.profile_image_url_https);
        this.tweetLink = make("a").attr("href","https://twitter.com/" + data.user.screen_name)
                        .append(this.tweetProfilePic, this.tweetDisplayName, this.tweetUsername);

        this.tweetHead = div("tweet-header").append(this.tweetLink);

        this.tweetText = div("tweet-text").text(data.full_text);
        this.tweetTime = div("tweet-time").text(data.created_at);

        this.tweetBody = div("tweet-body").append(this.tweetText, this.tweetTime);

        this.element = make("article").addClass("tweet").attr("data-id", data.id).append(this.tweetHead, this.tweetBody);

        return this;
    }
}

exports.Tweet = Tweet;
