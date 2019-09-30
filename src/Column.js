const $ = require("jquery");
const { div } = require("./Helpers.js");
const { ColumnHolder } = require("./ColumnHolder.js");

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
        this.headElement = div("column-header").append(this.columnTitle, this.columnUsername);
        this.element.append(this.headElement).append();
        this.body = div("column-body");
        return this;
    }

    placeInHolder() {
        ColumnHolder.getColumnHolder().append(this.element);
        return this;
    }

    updateTweets() {

    }
}

exports.Column = Column;
