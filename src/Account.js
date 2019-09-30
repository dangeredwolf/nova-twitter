const {StorageAccount} = require("./StorageAccount.js")

class Account {
    twitterId;
    bearerToken;
    authToken;
    userName;

    constructor(data) {
        this.twitterId = data.twitterId;
        this.bearerToken = data.bearerToken;
        this.authToken = data.authToken;
        this.userName = data.userName;
    }

    saveAccount() {
        StorageAccount.saveAccount(this)
    }
}

exports.Account = Account;
