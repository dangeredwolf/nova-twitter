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
                attributionText = "liked";
                break;
            case "favorited_retweet":
                attributionText = "liked a Tweet you retweeted";
                break;
            case "retweet":
                attributionText = "retweeted";
                break;
            case "retweet":
                attributionText = "retweeted a Tweet you retweeted";
                break;
            case "favorited_mention":
                attributionText = "liked a Tweet you were mentioned in";
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
        this.interactionLink = make("a").addClass("interaction-user-link").attr("href","https://twitter.com/" + data.sources[0].screen_name).attr("target","_blank")
                        .append(this.interactionProfilePic, this.interactionDisplayName);

        this.interactionTime = make("a").addClass("tweet-time").text(timeAgo(data.created_at)).attr("href","https://twitter.com/i/status/" + data.id_str).attr("target","_blank");
        this.interactionHead = div("tweet-header interaction-header").append(this.interactionLink, this.interactionAttrib, this.interactionTime);
        if (tweetAttached) {
            this.tweetDisplayName = div("tweet-display-name").text(data.targets[0].user.name);
            this.tweetUsername = div("tweet-username").text("@" + data.targets[0].user.screen_name);
            this.tweetLink = make("a").addClass("interaction-recipient-link").attr("href","https://twitter.com/" + data.targets[0].user.screen_name).attr("target","_blank")
                            .append(this.tweetDisplayName, this.tweetUsername);
            this.interactionHead.append(this.tweetLink)
        }

        this.interactionText = make("p").addClass("tweet-text").text(data.targets[0].full_text || data.targets[0].text);

        this.interactionBody = div("tweet-body").append(this.interactionText);

        this.element = make("article").addClass("interaction").attr("data-id", data.id).append(this.interactionHead, this.interactionBody);

        return this;
    }
}

exports.Interaction = Interaction;
