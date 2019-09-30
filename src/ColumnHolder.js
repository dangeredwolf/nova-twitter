const $ = require("jquery");
const {make, body, div} = require("./Helpers.js");

class ColumnHolder {
    static getColumnHolder() {
        return $(".column-holder")
    }
}

exports.ColumnHolder = ColumnHolder;
