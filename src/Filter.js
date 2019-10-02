class Filter {
    static filterTweet(tweet, column) {
        let isOK = true;
        let filters = column.filters;
        if (!!filters.action) {
            if (!filters.action.showActionsOnRetweets) {
                if (tweet.action === "favorited_retweet" || tweet.action === "retweeted_retweet") {
                    isOK = false;
                }
            }
            if (!filters.action.showFavorites) {
                if (tweet.action === "favorite") {
                    isOK = false;
                }
            }
            if (!filters.action.showFollowers) {
                if (tweet.action === "follow") {
                    isOK = false;
                }
            }
            if (!filters.action.showInteractionsOnMentioned) {
                if (tweet.action === "favorited_mention" || tweet.action === "retweeted_mention") {
                    isOK = false;
                }
            }
            if (!filters.action.showInteractionsOnTagged) {
                // ?
            }
            if (!filters.action.showLists) {
                // TODO: figure out what action is for lists
            }
            if (!filters.action.showMentions) {
                if (tweet.action === "reply") {
                    isOK = false;
                }
            }
            if (!filters.action.showQuoted) {
                // TODO: figure out what action is for quoted tweet
            }
            if (!filters.action.showRetweets) {
                if (tweet.action === "retweet" || tweet.action === "retweeted_mention") {
                    isOK = false;
                }
            }
        }
        if (!!filters.content) {
            if (!!filters.content.excluding) {
                let textToCompare = "";
                if (!!tweet.retweeted_status) {
                    textToCompare = tweet.retweeted_status.text
                } else {
                    textToCompare = tweet.full_text || tweet.text
                }

                filters.content.excluding.split(" ").forEach(query => {
                    if (textToCompare.match(query) !== null) {
                        isOK = false;
                    }
                })
            }
            if (!filters.content.includeRTs) {
                if (!!tweet.retweeted_status) {
                    isOK = false;
                }
            }
            if (!!filters.content.lang) {
                // todo: langs
            }
            if (!!filters.content.matching) {
                let textToCompare = "";
                if (!!tweet.retweeted_status) {
                    textToCompare = tweet.retweeted_status.text
                } else {
                    textToCompare = tweet.full_text || tweet.text
                }

                let foundOne = false;

                filters.content.matching.split(" ").forEach(query => {
                    if (textToCompare.match(query) !== null) {
                        foundOne = true;
                    }
                })

                if (!foundOne) {
                    isOK = false;
                }
            }
            if (!!filters.content.sinceTimeInSec) {
                // TODO: obey sinceTimeInSec
            }
            if (!!filters.content.type) {
                // tweets with images, tweets with videos, etc
            }
            if (!!filters.content.untilTimeInSec) {
                // TODO: obey sinceTimeInSec
            }
        }
        if (!!filters.engagement) {
            if (filters.engagement.minFavorites > 0) {
                if (typeof tweet.favorite_count !== "undefined" && tweet.retweet_count < filters.engagement.minFavorites) {
                    isOK = false;
                }
            }
            if (filters.engagement.minReplies > 0) {
                // if (typeof tweet.retweet_count !== "undefined" && tweet.retweet_count < filters.engagement.minReplies) {
                //     isOK = false;
                // }

                // hmmmmmm
            }
            if (filters.engagement.minRetweets > 0) {
                if (typeof tweet.retweet_count !== "undefined" && tweet.retweet_count < filters.engagement.minRetweets) {
                    isOK = false;
                }
            }
        }
        if (!!filters.location) {
            // todo: locations
        }
        if (!!filters.user) {
            if (!!filters.user.from_name) {
                if (!!tweet.user) {
                    if (tweet.user.screen_name !== filters.user.from_name) {
                        isOK = false;
                    }
                }
            }
            if (!!filters.user.from_type) {
                if (filters.user.from_type === "verified") {
                    if (typeof tweet.verified !== "undefined") {
                        if (!tweet.verified) {
                            isOK = false
                        }
                    }
                    if (typeof tweet.user.verified !== "undefined") {
                        if (!tweet.user.verified) {
                            isOK = false;
                        }
                    }
                }
            }
            if (!!filters.user.mention_name) {
                
            }
        }
        return isOK;
    }
}

exports.Filter = Filter;
