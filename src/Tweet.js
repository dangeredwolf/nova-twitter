const {make, div, timeAgo} = require("./Helpers.js");

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
        this.tweetProfilePic = make("img").attr("src", data.user.profile_image_url_https).addClass("tweet-profile-pic");
        this.tweetLink = make("a").attr("href","https://twitter.com/" + data.user.screen_name).attr("target","_blank")
                        .append(this.tweetProfilePic, this.tweetDisplayName, this.tweetUsername);

        this.tweetHead = div("tweet-header").append(this.tweetLink);

        this.tweetText = div("tweet-text").text(data.full_text || data.text);
        this.tweetTime = div("tweet-time").text(timeAgo(data.created_at));

        this.tweetBody = div("tweet-body").append(this.tweetText, this.tweetTime);

        this.element = make("article").addClass("tweet").attr("data-id", data.id).append(this.tweetHead, this.tweetBody);

        return this;
    }
}

exports.Tweet = Tweet;
