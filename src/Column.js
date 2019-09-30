const $ = require("jquery");
const { div } = require("./src/Helpers.js");
const { ColumnHolder } = require("./src/ColumnHolder.js");

class Column {

    element;
    headElement;
    icon;
    columnTitle;
    columnUsername;
    body;

    constructor() {
        this.element = div("column");
        this.columnTitle = div("column-title");
        this.columnUsername = div("column-username");
        this.headElement = div("column-header").append(columnTitle, columnUsername);
        this.element.append(this.headElement).append();
        this.body = div("column-body");
    }

    placeInHolder() {
        ColumnHolder.getColumnHolder().append(this.element);
    }
}

exports.Column = Column;
