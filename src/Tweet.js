const {make, div, timeAgo} = require("./Helpers.js");

class Tweet {
    element;
    tweetHead;
    tweetLink;
    retweetLink;
    tweetDisplayName;
    tweetUsername;
    tweetUsernameGroup;
    retweetUsernameGroup;
    tweetProfilePic;
    retweetDisplayName;
    retweetUsername;
    retweetProfilePic;
    tweetText;
    tweetBody;
    tweetTime;
    attribution;

    tweetActions;
    tweetActionReply;
    tweetActionRetweet;
    tweetActionLike;
    tweetActionMore;

    constructor(data) {
        this.tweetDisplayName = div("tweet-display-name").text(data.user.name);

        if (typeof data.retweeted_status === "undefined") {
            this.tweetUsername = div("tweet-username txt-mute").text("@" + data.user.screen_name);
            this.tweetProfilePic = make("img").attr("src", data.user.profile_image_url_https).addClass("tweet-profile-pic");

        }

        this.tweetUsernameGroup = div("tweet-username-group").append(this.tweetDisplayName, this.tweetUsername)

        this.tweetLink = make("a").attr("href","https://twitter.com/" + data.user.screen_name).attr("target","_blank")
                        .append(this.tweetProfilePic, this.tweetUsernameGroup);
        this.tweetTime = make("a").addClass("tweet-time").text(timeAgo(data.created_at)).attr("href","https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str).attr("target","_blank");

        this.tweetHead = div("tweet-header").append(this.tweetLink, this.tweetTime);

        this.tweetText = make("p").addClass("tweet-text").text(data.full_text || data.text);

        this.tweetBody = div("tweet-body").append(this.tweetText);

        this.element = make("article").addClass("tweet has-profile-pic").attr("data-id", data.id).attr("data-time", Date.parse(data.created_at)).append(this.tweetHead, this.tweetBody);


        if (typeof data.retweeted_status !== "undefined") {
            this.attribution = div("tweet-attribution").text("retweeted");
            this.retweetDisplayName = div("tweet-display-name retweet-display-name").text(data.retweeted_status.user.name);
            this.retweetUsername = div("tweet-username retweet-username txt-mute").text("@" + data.retweeted_status.user.screen_name);
            this.retweetProfilePic = make("img").attr("src", data.retweeted_status.user.profile_image_url_https).addClass("tweet-profile-pic retweet-profile-pic");


            this.retweetUsernameGroup = div("retweet-username-group tweet-username-group").append(this.retweetDisplayName, this.retweetUsername)
            this.retweetLink = make("a").addClass("retweet-link").attr("href","https://twitter.com/" + data.retweeted_status.user.screen_name).attr("target","_blank")
            .append(this.retweetProfilePic, this.retweetUsernameGroup);
            this.tweetHead.append(this.attribution, this.retweetLink);

            this.tweetText.text(data.retweeted_status.text);
            this.tweetTime.text(timeAgo(data.retweeted_status.created_at));
            this.element.addClass("is-retweet");
        }

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

        this.tweetFooter = div("tweet-footer").append(this.tweetActions)

        this.element.append(this.tweetFooter);

        M.Tooltip.init(
            [this.tweetActionReply[0],this.tweetActionRetweet[0],this.tweetActionLike[0]]
        )

        return this;
    }
}

exports.Tweet = Tweet;
