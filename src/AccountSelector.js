const {TweetDeckClient} = require("./TweetDeckClient.js");
const {StorageAccount} = require("./StorageAccount.js");
const {div, make, assert} = require("./Helpers.js");


class AccountSelector {
    element;
	select;
	selectedAccount = StorageAccount.getDefaultAccount();

    constructor(isComposeAccountSelector) {
        this.select = div("dropdown-children");

		// init materialize controller
		if (isComposeAccountSelector) {
			this.element = $(".compose .account-selector").append(this.select);
		} else {
			this.element = div("account-selector dropdown-menu").append(this.select);
		}

		let account = StorageAccount.getDefaultAccount();

        if (typeof window.contributees !== "undefined") {

            if (typeof window.mainAccount === "undefined") {
                TweetDeckClient.verifyCredentials({account:account}).then(mainAcc => {
                    window.mainAccount = mainAcc.data;
					console.log(mainAcc);

                    this.drawSelector();
                })
            } else {
				this.drawSelector();
			}


        } else {
            TweetDeckClient.getContributees({account:account}).then(contributees => {
				console.log(contributees);
                window.contributees = contributees.data;

                if (typeof window.mainAccount === "undefined") {
                    TweetDeckClient.verifyCredentials({account:account}).then(mainAcc => {
                        window.mainAccount = mainAcc.data;
						this.drawSelector();
                    })
                } else {
					this.drawSelector();
				}


            });
        }

		window.Dropdowns.push(this);

        return this;
    }

    drawSelector() {
        assert(window.mainAccount, "why did you call me? there's no main account");
        assert(window.contributees, "why did you call me? there's no contributees");

        this.select.append(this.makeOption({user:window.mainAccount}))

		window.contributees.forEach(acc => {
            this.select.append(this.makeOption(acc))
        });

		setTimeout(() => {
			this.element.attr("style","height: " + this.select.height() + "px")
		},0)

		// M.FormSelect.init(document.querySelectorAll(".compose .account-selector>select"));
    }



    makeOption(acc) {
        let thing = make("a").attr("href","#").addClass("dropdown-item dropdown-user waves-dark waves-effect").attr("value", acc.user.id).append(
            make("img").addClass("tweet-profile-pic").attr("src",acc.user.profile_image_url_https),
            "@" + acc.user.screen_name
        )

		thing.click(() => {
			this.element.toggleClass("open");

			this.selectedAccount = acc.user.id;

			if (this.element.hasClass("open")) {
				this.select.attr("style","")
			} else {
				this.element.scrollTop(0);
				this.select.attr("style","margin-top: -" + (thing.index()*50) + "px")
			}

		})

		return thing;
    }
}

exports.AccountSelector = AccountSelector;
