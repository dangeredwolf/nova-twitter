const {Storage} = require("./Storage.js");

class StorageColumn {
    static getColumns() {
        return Storage.get("columns");
    }

    static saveColumn(data) {

    }
}

exports.StorageColumn = StorageColumn;
