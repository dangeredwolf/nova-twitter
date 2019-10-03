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
    interactionFooter;
    interactionAttrib;
    interactionAttribLink;
    interactionTime;
    tweetDisplayName;
    tweetUsername;

    tweetActions;
    tweetActionReply;
    tweetActionRetweet;
    tweetActionLike;
    tweetActionMore;

    constructor(data) {
        let attributionText = "";
        var tweetAttached = true;
        let linkInAttribution = false;

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
            case "retweeted_retweet":
                attributionText = "retweeted a Tweet you retweeted";
                break;
            case "favorited_mention":
                attributionText = "liked a Tweet you were mentioned in";
                break;
            case "list_member_added":
                attributionText = "added you to their list ";
                linkInAttribution = {link:("https://twitter.com/" + data.target_objects[0].uri), name: data.target_objects[0].name}
                tweetAttached = false;
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

        this.interactionDisplayName = div("interaction-display-name tweet-display-name").text(data.sources[0].name);
        this.interactionAttrib = div("interaction-attribution").text(attributionText);
        this.interactionProfilePic = make("img").attr("src", data.sources[0].profile_image_url_https).addClass("tweet-profile-pic small");
        this.interactionLink = make("a").addClass("interaction-user-link")
                        .attr("href","https://twitter.com/" + data.sources[0].screen_name).attr("target","_blank")
                        .append(this.interactionProfilePic, this.interactionDisplayName);

        this.interactionTime = make("a").addClass("tweet-time txt-mute").text(timeAgo(data.created_at))
                                .attr("href","https://twitter.com/i/status/" + data.id_str).attr("target","_blank");

        if (!!linkInAttribution) {
            this.interactionAttribLink = make("a").addClass("interaction-attribution-link").attr("href",linkInAttribution.link)
                                   .attr("target","_blank").text(linkInAttribution.name)
        }

        this.interactionHead = div("tweet-header interaction-header").append(this.interactionLink, this.interactionAttrib, this.interactionAttribLink, this.interactionTime);
        if (tweetAttached) {
            let userPath = data.targets[0].retweeted_status ? data.targets[0].retweeted_status.user : data.targets[0].user
            this.tweetDisplayName = div("tweet-display-name").text(userPath.name);
            this.tweetUsername = div("tweet-username txt-mute").text("@" + userPath.screen_name);
            this.tweetLink = make("a").addClass("interaction-recipient-link").attr("href","https://twitter.com/" + data.targets[0].user.screen_name).attr("target","_blank")
                            .append(this.tweetDisplayName, this.tweetUsername);
            this.interactionHead.append(this.tweetLink)
        }

        if (tweetAttached) {

            this.tweetActionReply = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").html(
                make("i").addClass("material-icons").text("reply")
            ).attr("href","#").attr("data-tooltip","Reply")

            this.tweetActionRetweet = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").html(
                make("i").addClass("icon icon-retweet").text("repeat")
            ).attr("href","#").attr("data-tooltip","Retweet")

            this.tweetActionLike = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat tooltipped").html(
                make("i").addClass("icon icon-heart").text("heart")
            ).attr("href","#").attr("data-tooltip","Like Tweet")

            this.tweetActionMore = make("a").addClass("tweet-action waves-effect waves-dark waves-circle btn-small btn-flat").html(
                make("i").addClass("material-icons").text("more_horiz")
            ).attr("href","#")

            M.Tooltip.init(
                [this.tweetActionReply[0],this.tweetActionRetweet[0],this.tweetActionLike[0]]
            )

            Waves.attach(
                this.tweetActionReply[0],
                this.tweetActionRetweet[0],
                this.tweetActionLike[0],
                this.tweetActionMore[0]
            )

            this.tweetActions = div("tweet-actions").append(
                this.tweetActionReply,
                this.tweetActionRetweet,
                this.tweetActionLike,
                this.tweetActionMore
            );

        }

        this.interactionFooter = div("interaction-footer tweet-footer").append(this.tweetActions)

        this.interactionText = make("p").addClass("tweet-text").text(!!data.targets[0].retweeted_status ? data.targets[0].retweeted_status.full_text : (data.targets[0].full_text || data.targets[0].text));

        this.interactionBody = div("tweet-body").append(this.interactionText);

        this.element = make("article").addClass("interaction").attr("data-time", Date.parse(data.created_at)).attr("data-id", data.id).append(this.interactionHead, this.interactionBody, this.interactionFooter);

        return this;
    }
}

exports.Interaction = Interaction;
