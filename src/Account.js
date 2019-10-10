const {StorageAccount} = require("./StorageAccount.js")

class Account {
    twitterId;
    bearerToken;
    authToken;
    userName;
	contribId;
	// twitterSess;

    constructor(data) {
        this.twitterId = data.twitterId;
        this.bearerToken = data.bearerToken;
        this.authToken = data.authToken;
        this.userName = data.userName;
        this.contribId = data.contribId;
		// this.twitterSess = data.twitterSess;
    }

    saveAccount() {
        StorageAccount.saveAccount(this)
    }
}

exports.Account = Account;
