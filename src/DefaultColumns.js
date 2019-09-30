const {Column} = require("./Column.js");
const {ColumnHome} = require("./ColumnHome.js");
const {StorageAccount} = require("./StorageAccount.js");

class DefaultColumns {
    static makeDefaultColumns() {
        // let home = new ColumnHome(StorageAccount.getDefaultAccount()).placeInHolder();
        // home.renderTweets();
        // home.renderTimer();
    }
}

exports.DefaultColumns = DefaultColumns;
