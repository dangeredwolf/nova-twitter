const {TweetDeckClient} = require("./TweetDeckClient.js");
const {div, make, assert} = require("./Helpers.js");


class AccountSelector {
    element;
    constructor() {
        this.select = make("select");
        this.element = div("input-field").append(this.select);

        if (typeof window.contributees !== "undefined") {

            if (typeof window.mainAccount === "undefined") {
                TweetDeckClient.verifyCredentials({account:account}).then(mainAcc => {
                    window.mainAccount = mainAcc.data;

                    this.drawSelector();
                })
            }


        } else {
            TweetDeckClient.getContributees({account:account}).then(contributees => {
                window.contributees = contributees.data;

                if (typeof window.mainAccount === "undefined") {
                    TweetDeckClient.verifyCredentials({account:account}).then(mainAcc => {
                        window.mainAccount = mainAcc.data;
                    })
                }
                this.drawSelector();

            });
        }

        return this;
    }

    drawSelector() {
        assert(window.mainAccount, "why did you call me? there's no main account");

        window.contributees.forEach(acc => {
            this.select.append(
                makeOption(acc)
            )
        })
    }



    static makeOption(acc) {
        return make("option").append(
            make("img").addClass("tweet-profile-pic").attr("src",acc.user.profile_image_url_https),
            "@" + acc.user.screen_name
        )
    }
}

exports.AccountSelector = AccountSelector;
