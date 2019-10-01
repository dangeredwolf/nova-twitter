const {make, div, timeAgo} = require("./Helpers.js");
const {Tweet} = require("./Tweet.js");

class Interaction {
    element;
    interactionHead;
    interactionLink;
    interactionDisplayName;
    interactionProfilePic;
    interactionText;
    interactionBody;
    interactionTime;
    tweetDisplayName;
    tweetUsername

    constructor(data) {
        let attributionText = "";
        var tweetAttached = true;

        switch(data.action) {
            case "favorite":
                attributionText = "liked"
                break;
            case "retweet":
                attributionText = "retweeted"
                break;
            case "favorited_mention":
                attributionText = "liked a Tweet you were mentioned in"
                break;
            case "follow":
                attributionText = "followed you";
                tweetAttached = false;
                break;
            case "reply":
                return new Tweet(data.targets[0]);
                break;
            default:
                console.error("Unknown interaction type " + data.action);
        }

        console.log(data.sources[0])

        this.interactionDisplayName = div("interaction-display-name").text(data.sources[0].name);
        this.interactionAttrib = div("interaction-attribution").text(attributionText);
        this.interactionProfilePic = make("img").attr("src", data.sources[0].profile_image_url_https).addClass("tweet-profile-pic small");
        this.interactionLink = make("a").attr("href","https://twitter.com/" + data.sources[0].screen_name).attr("target","_blank")
                        .append(this.interactionProfilePic, this.interactionDisplayName, this.interactionAttrib);

        this.interactionHead = div("tweet-header").append(this.interactionLink);
        if (tweetAttached) {
            this.tweetDisplayName = div("tweet-display-name").text(data.targets[0].user.name);
            this.tweetUsername = div("tweet-username").text(data.targets[0].user.screen_name);
            this.tweetLink = make("a").attr("href","https://twitter.com/" + data.targets[0].user.screen_name).attr("target","_blank")
                            .append(this.tweetDisplayName, this.tweetUsername);
            this.interactionHead.append(this.tweetLink)
        }

        this.interactionText = div("tweet-text").text(data.targets[0].full_text);
        this.interactionTime = div("tweet-time").text(timeAgo(data.created_at));

        this.interactionBody = div("tweet-body").append(this.interactionText, this.interactionTime);

        this.element = make("article").addClass("interaction").attr("data-id", data.id).append(this.interactionHead, this.interactionBody);

        return this;
    }
}

exports.Interaction = Interaction;
