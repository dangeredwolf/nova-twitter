const $ = require("jquery");
const { make, div } = require("./Helpers.js");

class Modal {
	element;

	head;
	title;
	body;
	footer;

	constructor(parameters) {
		parameters = parameters || {};

		this.title = make("b").addClass("mdl-title");
		this.head = div("mdl-header").append(this.title);
		this.body = div("mdl-body");
		this.footer = div("mdl-footer");
		this.element = div("mdl").append(this.head, this.body, this.footer).click(e => {
			e.stopPropagation();
		});

		window.Modals.push(this);

		if (parameters.display === true) {
			return display();
		} else {
			return this;
		}
	}

	display() {

		this.beforeDisplay();

		$(".mdl-container").append(this.element);

		this.afterDisplay();

		return this;
	}

	beforeDisplay() {
		// Usable in subclass modals
	}

	afterDisplay() {
		// Usable in subclass modals
	}

	dismiss() {
		this.element.remove();
	}
}

exports.Modal = Modal;
