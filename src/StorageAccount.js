const Store = require("electron-store");

class StorageAccount {
    static getAccounts() {
        return Store.get("accounts");
    }

    static saveAccount(data) {
        Store.set("accounts", Store.get("accounts").push(data));
    }
}

exports.StorageAccount = StorageAccount;
