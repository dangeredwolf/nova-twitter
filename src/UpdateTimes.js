const $ = require("jquery");
const {timeAgo} = require("./Helpers.js");

class UpdateTimes {
    static do() {
        $(".tweet,.interaction").each((i, tweet) => {
            // console.log(tweet.getAttribute("data-time"),parseInt(tweet.getAttribute("data-time"))),timeAgo(parseInt(tweet.getAttribute("data-time")));
            let time = timeAgo(parseInt(tweet.getAttribute("data-time")));
            $(tweet).children(".tweet-header").children(".tweet-time").text(time);
        })
    }
}

exports.UpdateTimes = UpdateTimes;
