const {ColumnHome} = require("./ColumnHome.js");
const {StorageAccount} = require("./StorageAccount.js");

class ViewComfortable {
	constructor() {
		window.comfortableSelectedUser = StorageAccount.getDefaultAccount(); //todo: store as pref
		return this;
	}

	makeView() {
		$(".column-holder").append(
			div("View ViewComfortable").append(
				new ColumnHome(window.comfortableSelectedUser).renderTimer().element
			)
		)
	}
}

exports.ViewComfortable = ViewComfortable;
