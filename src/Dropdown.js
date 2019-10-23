/*
	new Dropdown(Array options, optional Tweet tweet, css Position)

	option:
		string (html supported) opt.label = label for dropdown (include icon too)
		optional function opt.activate = function to activate when button press
		(if optional Dropdown parameter tweet is specified, it is passed on to the function)
*/


class Dropdown {
	constructor(opts, tweet, position) {
		this.element = make("ul").addClass("dropdown-menu").css(position);

		opts.forEach(opt => {
			let el;
			if (opt.divider) {
				el = make("li").addClass("dropdown-divider")
			} else {
				el = make("li").append(
					make("a").addClass("waves-effect waves-dark dropdown-item").attr("href","#").html(opt.label).click(e => {
						this.dismiss();
						e.stopPropagation();
						(opt.activate || (()=>{}))(tweet); // effectively making the activate function an optional parameter
					})
				)
			}
			this.element.append(
				el
			)
		});

		window.Dropdowns.push(this);

		return this;
	}

	dismiss() {
		// TODO: add fadeout animations and stuff
		this.element.remove();
	}
}

exports.Dropdown = Dropdown;
