const {Storage} = require("./Storage.js");
const {Account} = require("./Account.js");
const {LoginController} = require("./LoginController.js");

class StorageAccount {
    static getAccounts() {
        return Storage.get("accounts");
    }

    static saveAccount(data) {
        let array = (Storage.get("accounts") || []);
		if (typeof data.contribId === "undefined") {
			data.contribId = "" + data.twitterId;
		}
        array.push(data);

        Storage.set("accounts", array);
    }

    static deleteAccount(id) {
        let array = (Storage.get("accounts") || []);
        array = array.filter(acc => (acc.twitterId !== id));
        Storage.set("accounts",array);
    }

	static deleteAllAccounts() {
		Storage.set("accounts",[]);
	}

    static getAccount(id) {
        let theAcc = ((Storage.get("accounts") || []).filter(acc => (acc.twitterId === id)) || [])[0];
        return theAcc;
    }

    static getDefaultAccount() {
        let theAcc = ((Storage.get("accounts") || []).filter(acc => (acc.default)) || [])[0] || StorageAccount.getAccounts()[0];

		if (typeof theAcc === "undefined") {
			new LoginController();
		}

        return theAcc;
    }
}

exports.StorageAccount = StorageAccount;
